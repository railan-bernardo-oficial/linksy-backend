import { FastifyInstance, FastifyPluginOptions } from "fastify";
import PostController from "../controllers/post";
import Authenticate from "../auth/autenticate";

export default async function postRoutes(fastify: FastifyInstance, opts: FastifyPluginOptions){
  const postController = new PostController;

   // Autenticação JWT
   const auth = new Authenticate();

    // GET buscar postagem
    fastify.get('/posts', { preHandler: auth.autenticate }, postController.GetAllPosts.bind(postController))
   // POST cria postagem
   fastify.post('/post', { preHandler: auth.autenticate }, postController.CreatePost.bind(postController));
}