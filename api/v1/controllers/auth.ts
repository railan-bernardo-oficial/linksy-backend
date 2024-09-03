import fastify, { FastifyRequest, FastifyReply } from "fastify";
import { PrismaClient } from "@prisma/client";
import  bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import { error } from "console";
const prisma = new PrismaClient();

class AuthController{

    // Login
    async login(request: FastifyRequest, reply: FastifyReply){
        const { email, password } = request.body as { email: string, password: string }
        const user = await prisma.user.findFirst({
            where: {
                email
            },
        })

        if(!user) return reply.code(404).send({ message: 'Inválido', error: "USER_NOT_FOUND" })

        const hashPassword = await bcrypt.compare(password, user.password);

        if(!hashPassword) reply.code(401).send({ message: 'Não autorizado!' })
          
        const token = jwt.sign({ email: user.email }, process.env.SECRET_KEY , { expiresIn: '1d' })
        
        delete user.password;

        reply.code(200).send({ token, user });
    }

}

export default AuthController;