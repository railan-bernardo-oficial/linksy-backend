import fastify, { FastifyRequest, FastifyReply } from "fastify";
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';
import { string, z } from "zod";
import { CreateUserDTO, DeleteUserParams, UpdateUserDTO, UpdateUserParams } from "../dtos/createUserDTO";

const prisma = new PrismaClient();

class UserController {

    // Pegar um usuário
    async getUser(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as { id: string }

        const user = await prisma.user.findUnique({
            where: {
                id: parseInt(id)
            },
            select: {
                id: true,
                avatarUrl: true,
                name: true,
                email: true,
                password: false,
            }
        })

        if (user) {
            return reply.code(200).send(user)
        } else {
            return reply.code(404).send({ message: 'Usuário não encontrado' })
        }
    }

    // Criar um usuário
    async CreateUser(request: FastifyRequest, reply: FastifyReply) {
        const createUserSchema = z.object({
            name: z.string({ required_error: "Nome é obrigatório" }),
            avatarUrl: z.string().nullable().optional(),
            email: z.string({ required_error: "E-mail é obrigatório" }).email("E-mail precisa ser válido"),
            password: z.string({ required_error: "Senha é obrigatório" })
        })

        try {
            const { name, avatarUrl, email, password } = createUserSchema.parse(request.body) as CreateUserDTO;

            // Verificar se o e-mail já está em uso
            const existingUser = await prisma.user.findUnique({
                where: { email }
            });

            if (existingUser) {
                return reply.code(400).send({ message: "O e-mail já está em uso", error: "EMAIL_ALREADY_IN_USE" });
            }

            const passwordHash = await hashPassword(password)
            const user = await prisma.user.create({
                data: {
                    name,
                    avatarUrl,
                    email,
                    password: passwordHash
                }
            })

            reply.code(201).send({ message: "Conta criada com sucesso", error: null, user: user })
        } catch (e) {
            if (e instanceof z.ZodError) {
                reply.code(400).send({ message: "Erro de validação", error: e.errors });
            } else {
                reply.code(500).send({ message: "Conta não foi possível ser criada", error: e });
            }
        }
    }

    // Atualiza usuário
    async UpdateUser(request: FastifyRequest<{ Params: UpdateUserParams }>, reply: FastifyReply) {
        const updateUserSchema = z.object({
            name: z.string({ required_error: "Nome é obrigatório" }),
            avatarUrl: z.string().nullable().optional(),
            email: z.string({ required_error: "E-mail é obrigatório" }).email("E-mail precisa ser válido"),
        })
        const userId = parseInt(request.params.id, 10);
    
        // Validação dos dados de entrada
        const { name, email, avatarUrl } = updateUserSchema.parse(request.body) as UpdateUserDTO;
    
        try {
            // Verificar se o usuário existe
            const existingUser = await prisma.user.findUnique({
                where: { id: userId }
            });
    
            if (!existingUser) {
                return reply.code(404).send({ message: "Usuário não encontrado", error: "USER_NOT_FOUND" });
            }
    
            // Verificar se o e-mail já está em uso por outro usuário
            const emailTaken = await prisma.user.findUnique({
                where: { email }
            });
    
            if (emailTaken && emailTaken.id !== userId) {
                return reply.code(400).send({ message: "O e-mail já está em uso", error: "EMAIL_ALREADY_IN_USE" });
            }
    
            // Atualizar usuário
            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: {
                    name,
                    email,
                    avatarUrl
                }
            });
    
            reply.code(200).send({ message: "Usuário atualizado com sucesso", error: null, user: updatedUser });
        } catch (e) {
            if (e instanceof z.ZodError) {
                reply.code(400).send({ message: "Erro de validação", error: e.errors });
            } else {
                reply.code(500).send({ message: "Não foi possível atualizar o usuário", error: e });
            }
        }
    }
    
    // Deleta usuário
    async DeleteUser(request: FastifyRequest<{ Params: DeleteUserParams }>, reply: FastifyReply){
       const userId = parseInt(request.params.id, 10);

       try{
         const existingUser = await prisma.user.findUnique({
            where: { id: userId }
         })

         if(!existingUser){
            return reply.code(404).send({ message: "Usuário não encontrado", error: "USER_NOT_FOUND" })
         }

         // Deleta usuário
         await prisma.user.delete({
            where: { id: userId }
         })

         reply.code(200).send({ message: "Usuário deletado com sucesso", error: null });
       }catch(e){
         reply.code(500).send({ message: "Não foi possível deletar o usuário", error: e.message });
       }
    }

}

async function hashPassword(plainPassword: string): Promise<string> {
    const saltRounds = 10; // Define o número de rounds para gerar o salt
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    return hashedPassword;
}

export default UserController;