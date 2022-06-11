import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthController {
    public async login({ auth, request, response }: HttpContextContract) {
        try {
            const {email, password} = request.body();
            const token = await auth.attempt(email, password);
            return response.status(200).json({
                auth:true,
                token
            })
        } catch {
           return response.status(400).json({
                auth:false,
                message:"Invalid Credentials"
            })
        }
    }
}
