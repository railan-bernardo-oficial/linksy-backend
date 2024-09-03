import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";

class Autenticate {
    async autenticate(request: FastifyRequest, reply: FastifyReply){
        const token = request.headers.authorization?.replace('Bearer ', '');

        if(!token){
            reply.code(401).send({ message: "Não autorizado" });
            return;
        }

        try{
            const decoded = verifyToken(token);
            request.user = decoded.user;
        }catch(e){
            reply.code(401).send({ message: 'Token de autenticação inválido' });
            return;
        }
    }
}

// Valida o token jwt
async function verifyToken(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded);
            }
        });
    });
}

export default Autenticate;