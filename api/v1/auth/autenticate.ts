import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();

class Autenticate {
    async autenticate(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        const token = request.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
            reply.code(401).send({ message: 'Não autorizado' });
            return;
        }
        try {
            await verifyToken(token).then((res) =>{
                request.user = res.user;
            }).catch((err) =>{

                console.log("ERROR_TOKEN => ", err.message)
            });
           
        } catch (e) {
            console.log("ERROR => ", e)
            reply.code(401).send({ message: 'Token de autenticação inválido' });
        }
    }
}

const verifyToken = (token: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        const secretKey = process.env.SECRET_KEY;
        jwt.verify(token, secretKey as string, (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded);
            }
        });
    });
}

export default Autenticate;
