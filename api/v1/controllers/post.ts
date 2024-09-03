import { FastifyReply, FastifyRequest } from "fastify";
import z from 'zod'
import { CreatePostDOT } from "../dtos/createPostDTO";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class PostController {
    // Pegar todas as postagem
    async GetAllPosts(request: FastifyRequest, reply: FastifyReply){
        const posts = await prisma.post.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatarUrl: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return reply.code(200).send({ posts: posts })
    }

    // Criar uma postagem
    async CreatePost(request: FastifyRequest, reply: FastifyReply) {
        const createPostSchema = z.object({
            userId: z.number(),
            content: z.string().nullable().optional(),
            imageUrl: z.string().nullable().optional()
        })

        try {
            const { userId, content, imageUrl } = createPostSchema.parse(request.body) as CreatePostDOT;
            
            if (!userId) {
                return reply.code(401).send({ message: "Usuário não autenticado", error: "UNAUTHORIZED" });
            }
            
            const post = await prisma.post.create({
                data: {
                    userId,
                    content,
                    imageUrl
                }
            })
            reply.code(201).send({ message: "Post criado com sucesso", error: null, post: post })
        } catch (e) {
            if (e instanceof z.ZodError) {
                reply.code(400).send({ message: "Erro de validação", error: e.errors });
            } else {
                reply.code(500).send({ message: "Post não foi possível ser criada", error: e });
            }
        }
    }
}

export default PostController;