import { FastifyInstance, FastifyPluginOptions } from "fastify";
import AuthController from "../controllers/auth";

export default async function authRoutes(fastify: FastifyInstance, opts: FastifyPluginOptions){
     const authController = new AuthController();

    // POST Login
    fastify.post('/login', authController.login.bind(authController));
}