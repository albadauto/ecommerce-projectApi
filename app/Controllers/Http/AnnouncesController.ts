import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Announce from 'App/Models/Announce';
import Application from "@ioc:Adonis/Core/Application";
import uuid from "react-uuid";
import Database from "@ioc:Adonis/Lucid/Database";

export default class AnnouncesController {
    private validationOptions = {
        types: ['image'],
        size: '2mb'
    }
    public async store({ request, response }: HttpContextContract) {
        try {
            const { name, description, type, id_user, price } = request.body();
            const image = request.file("photo", this.validationOptions);
            var photo: string;
            if (image) {
                image.fileName = `${uuid()}.${image.extname}`;
                photo = "uploads" + `/${image.fileName}`;
                await image.move(Application.tmpPath("uploads"), { name: image.fileName });
                await Announce.create({ name, photo, description, type, id_user, price });
            }
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
        } catch (err) {
            throw new Error(err);
        }
    }

    public async destroy({ params, response }: HttpContextContract) {
        try {
            const result = await Announce.findOrFail(params.id);
            if (result) {
                await result.delete();
                return response.status(200).json({
                    deleted: true
                })
            } else {
                return response.status(400).json({
                    deleted: false,
                    message: "Anúncio não encontrado."
                })
            }
        } catch (err) {
            throw new Error(err);
        }
    }

    public async show({ params, response }: HttpContextContract) {
        try {
            const result = await Announce.findOrFail(params.id);
            if (result) {
                return response.status(200).json({
                    result
                })
            } else {
                return response.status(400).json({
                    message: "Não foi encontrado esse anuncio"
                })
            }
        } catch (err) {
            console.log(err);
        }
    }

    public async findAllAnnounces({ request, response }: HttpContextContract) {
        try {
            const result = await Database.from("announces as a")
                            .join("users as u", "a.id_user","u.id") 
                            
            if (result){
                return response.status(200).json({
                    error:false,
                    result
                })
            }else{
                return response.status(400).json({
                    error: true,
                    message:"Não tem anúncios disponiveis!"
                })
            }

        } catch (err) {
            console.log(err);
        }
    }

}
