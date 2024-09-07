import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();

class AuthController {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    // Login
    async login(request: FastifyRequest, reply: FastifyReply) {
        const { email, password } = request.body as { email: string, password: string };
        const user = await this.prisma.user.findFirst({
            where: {
                email
            },
        });

        if (!user) return reply.code(404).send({ message: 'Inválido', error: "USER_NOT_FOUND" });

        const hashPassword = await bcrypt.compare(password, user.password);

        if (!hashPassword) return reply.code(401).send({ message: 'Não autorizado!' });
        const secretKey = process.env.SECRET_KEY;

        if (!secretKey) {
            throw new Error('SECRET_KEY is not defined');
         }

        const token = jwt.sign({ email: user.email }, secretKey, { expiresIn: '5d' });

        const { password: _, ...userWithoutPassword } = user;

        reply.code(200).send({ token, user: userWithoutPassword });
    }
}

export default AuthController;
