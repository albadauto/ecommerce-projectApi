import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Announce from 'App/Models/Announce';

export default class AnnouncesController {
    public async store({ request, response }: HttpContextContract) {
        try {
            const { name, description, photo, type } = request.body();
            await Announce.create({ name, description, photo, type });
            return response.status(200).json({
                created: true,
                message: "Anúncio criado com sucesso!"
            })

        } catch (err) {
            throw new Error(err);
        }
    }

    public async index({ response }: HttpContextContract) {
        try {
            const result = await Announce.all();
            if (result.length > 0) {
                return response.status(200).json({
                    result
                })
            } else {
                return response.status(400).json({
                    message: "Não foi encontrado nenhum registro de anúncio!"
                })
            }
        } catch {
            console.log("Deu erro!");
        }
    }

    public async destroy({ params, response }: HttpContextContract) {
        try {
            const result = await Announce.findOrFail(params.id);
            if (result){
                await result.delete();
                return response.status(200).json({
                    deleted: true
                })
            }else{
                return response.status(400).json({
                    deleted: false,
                    message: "Anúncio não encontrado."
                })
            }
        } catch {
            console.log("Deu erro!");
        }
    }
}
