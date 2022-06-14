import Mail from '@ioc:Adonis/Addons/Mail';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Recover from 'App/Models/Recover';
import User from 'App/Models/User';


export default class UsersController {

    public async insertUser({ request, response }: HttpContextContract) {
        try {
            const insert = request.body();
            if (insert) {
                await User.create(insert);
                return response.status(200).json({
                    created: true,
                    message: "Usuário Registrado! bem vindo(a) ao sistema!"
                })
            } else {
                return response.status(400).json({
                    created: false,
                    message: "Digite algo válido para registro de usuário"
                })
            }
        } catch (err) {
            throw new Error(err);
        }
    }

    public async recoverPass({ request, response, params }: HttpContextContract) {
        try {
            const { code } = request.body();
            const isCode = await Recover.findBy("recover_code", code);
            if (isCode) {
                const { password, id } = request.body();
                const user = await User.findOrFail(id);
                user.password = password;
                user.save();
                return response.status(200).json({
                    recovered: true,
                    message: "Atualizado com sucesso!"
                })
            } else {
                return response.status(400).json({
                    recovered: false,
                    message: "Código não válido!"
                })
            }
        } catch (err) {
            console.log(err);
        }
    }

    public async updatePassword({ request, response, params }: HttpContextContract) {
        try {
            const code = (Math.random() + 1).toString(36).substring(10).toUpperCase();
            const id_usr = params.id;
            const { email } = request.body();
            const emailUser = await User.findBy("email", email);
            if (emailUser) {
                await Recover.create({ id_usr: id_usr, recover_code: code });
                this.sendMail(email, "PLX - Recuperação de senha", "Use o código " + `${code} para a atualização da sua senha`);
                response.status(200).json({
                    send: true,
                    message: "Email enviado!"
                })
            } else {
                response.status(400).json({
                    send: false,
                    message: "Usuario não encontrado!"
                })
            }
        } catch (err) {
            console.log(err)
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

    private async sendMail(to: string, subject: string, text: string) {
        try {
            await Mail.send((message) => {
                message
                    .to(to)
                    .from("joseadauto923@hotmail.com")
                    .subject(subject)
                    .text(text)
            })
        } catch (err) {
            console.log(err);
        }

    }

    public async findUserByEmail({ request, response }: HttpContextContract) {
        try {
            const { email } = request.body();
            const result = await User.findBy("email", email);
            if (result){
                return response.status(200).json({
                    error: false,
                    result
                })
            }else{
                return response.status(400).json({
                    error: true,
                    message: "Nenhum email encontrado"
                })
            }
        } catch (err) {
            console.log(err)
        }
    }

    public async findUserById({ params, response }: HttpContextContract) {
        try {
            const result = await User.findOrFail(params.id);
            if (result){
                return response.status(200).json({
                    error: false,
                    result
                })
            }else{
                return response.status(400).json({
                    error: true,
                    message: "Nenhum usuario encontrado"
                })
            }
        } catch (err) {
            console.log(err)
        }
    }
}
