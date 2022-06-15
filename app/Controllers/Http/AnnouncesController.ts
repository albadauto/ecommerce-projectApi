import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Announce from 'App/Models/Announce';
import Application from "@ioc:Adonis/Core/Application";
import uuid from "react-uuid";
export default class AnnouncesController {
    private validationOptions = {
        types: ['image'],
        size: '2mb'
    } 
    public async store({ request, response }: HttpContextContract) {
        try {
            const { name, description, type } = request.body();
            await Announce.create({ name, description,  type });
            
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
        } catch(err) {
            throw new Error(err);
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
        } catch(err) {
            throw new Error(err);
        }
    }

    // public async show({params, response}: HttpContextContract){
    //     try{
    //         const result = await Announce.findOrFail(params.id);
    //         if(result){
    //             return response.status(200).json({
    //                 result
    //             })
    //         }else{
    //             return response.status(400).json({
    //                 message:"Não foi encontrado esse anuncio"
    //             })
    //         }
    //     }catch(err){    
    //         console.log(err);
    //     }
    // }

    public async testImage({request}: HttpContextContract){
        try{
            const cover_image = request.file('cover_image');
            if(cover_image){
                cover_image.fileName = `${uuid()}.${cover_image.extname}`;
                await cover_image.move(Application.tmpPath("uploads"), {name:cover_image.fileName});
                console.log("Feito!")
            }
        }catch(err){
            console.log(err);
        }
    }
   
}
