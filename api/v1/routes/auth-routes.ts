import { FastifyInstance, FastifyPluginOptions } from "fastify";
import AuthController from "../controllers/auth";
import { PrismaClient } from "@prisma/client";


export default async function authRoutes(fastify: FastifyInstance, opts: FastifyPluginOptions){
    const prisma = new PrismaClient(); 
    const authController = new AuthController(prisma);

    // POST Login
    fastify.post('/login', authController.login.bind(authController));
}