import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User';

export default class UsersController {

    public async insertUser({ request, response }: HttpContextContract) {
        try {
            const insert = request.body();
            if (insert){
                await User.create(insert);
                return response.status(400).json({
                    created: true,
                    message: "Usuário Registrado! bem vindo(a) ao sistema!"
                })
            }else{
                return response.status(400).json({
                    created: false,
                    message: "Digite algo válido para registro de usuário"
                })
            }
        } catch (err) {
            throw new Error(err);
        }
    }

    public async specialRoute({ request, response }: HttpContextContract) {
        try {
            const insert = request.body();
            await User.create(insert);
            return response.json({
                message: "shhhh, welcome root",
                created: true
            })
        } catch (err) {
            throw new Error(err);
        }
    }
}
