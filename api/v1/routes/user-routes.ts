import { FastifyInstance, FastifyPluginOptions } from "fastify";
import UserController from "../controllers/user";
import Authenticate from "../auth/autenticate";

export default async function userRoutes(fastify: FastifyInstance, opts: FastifyPluginOptions) {
    const userController = new UserController();
    
    // Autenticação JWT
    const auth = new Authenticate();

    // GET user
    fastify.get('/user/:id', { preHandler: auth.autenticate } , userController.getUser.bind(userController))

    // POST criar usuário
    fastify.post('/user', { preHandler: auth.autenticate }, userController.CreateUser.bind(userController))
    
    // PUT atualizar usuário
    fastify.put('/user/:id', { preHandler: auth.autenticate }, userController.UpdateUser.bind(userController))

    // DELETE deleta usuário
    fastify.delete('/user/:id', { preHandler: auth.autenticate }, userController.DeleteUser.bind(userController))

}