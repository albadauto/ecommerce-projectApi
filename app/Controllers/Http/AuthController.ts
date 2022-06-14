import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User';

export default class AuthController {
    public async login({ auth, request, response }: HttpContextContract) {
        try {
            const {email, password} = request.body();
            const  userId = await User.findBy("email", email);
            const token = await auth.attempt(email, password);
            return response.status(200).json({
                auth:true,
                token,
                id: userId?.id
            })
        } catch {
           return response.status(400).json({
                auth:false,
                message:"Invalid Credentials"
            })
        }
    }
}
