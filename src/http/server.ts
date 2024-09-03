import fastify from "fastify";
import multipart from "@fastify/multipart";
import cors from "@fastify/cors"; 
const app = fastify({ logger: true });

// Registrar o plugin de CORS
app.register(cors, {
    origin: '*', // Permite qualquer origem
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
  });

app.register(multipart)

// Routes
import userRoutes from "../../api/v1/routes/user-routes";
import postRoutes from "../../api/v1/routes/post-routes";
import authRoutes from "../../api/v1/routes/auth-routes";

// Registrando as rotas
app.register(userRoutes, { prefix: '/api/v1' })
app.register(postRoutes, { prefix: '/api/v1' })
app.register(authRoutes, { prefix: '/api/v1' })

app.listen({
    host: '0.0.0.0',
    port: 3333
}).then(() =>{
    console.log("Server runing... 🚀")
})