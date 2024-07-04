import { log, sleep, Random, stringify } from "../core/utils.mjs";
import BaseContoller from "../core/BaseContoller.mjs";
import {body, query,validationResult} from "express-validator"
import Translate from "../core/Translate.mjs";
import { use } from "i18next";
import {Redis} from "../global.mjs";
import Crypto from "../core/Crypto.mjs";
import dateTime from "../core/dateTime.mjs";




class userController extends BaseContoller{


    constructor(){
        super();
    }
    
    
    
    async index(req,res){
        try{
            // const result = await this.#loginValidation(req);
            // if(!result.isEmpty()){
            //     return res.send(result?.errors[0].msg);
            // }

            const data = {
                "title" : Translate.t("user.title")
            };
            
            return res.render(`user/index.html`,data);
        }catch(e){
            return super.toError(e,req,res);
        }
    }
    
    async #loginValidation(req){
        await body('email').not().isEmpty().withMessage('Err1')
        .isEmail().withMessage("Err2").run(req);
        await body('password').not().isEmpty().withMessage('Err3').run(req);

        return validationResult(req);
    }

    async postLogin(req,res){
        try{
            const result = await this.#loginValidation(req);
            if(!result.isEmpty()){
                return res.redirect(`?msg=${result?.errors[0]?.msg}`);
            }
            const email = await super.input(req.body.email);
            const password = await super.input(req.body.password);
            const hashEmail = Crypto.hash(email);
            const user = await Redis.get(`user_${hashEmail}`);
            
            if( user?.id && user?.password === password){
                
                return res.redirect(`?msg=ok`);
            }else{
                return res.redirect(`?msg=Err4`);
            }

        }catch(e){
            return super.toError(e,req,res);
        }
    }

   


    async register(req,res){
        try{
            const data = {
                "title" : Translate.t("user.register")
            };
            return res.render(`user/register.html`,data);
        }catch(e){
            return super.toError(e,req,res);
        }
    }


    async #registerValidation(req){
        await body('email').not().isEmpty().withMessage('Err1')
        .isEmail().withMessage("Err2").run(req);
        await body('password1').not().isEmpty().withMessage('Err3').run(req);
        await body('password2').not().isEmpty().withMessage('Err4').run(req);


        return validationResult(req);
    }

    async postRegister(req,res){
        try{
            const result = await this.#registerValidation(req);
            log(result);
            if(!result.isEmpty()){
                return res.redirect(`register?msg=${result?.errors[0]?.msg}`);
            }
            const email = await super.input(req.body.email);
            const password1 = await super.input(req.body.password1);
            const password2 = await super.input(req.body.password2);
            if(password1 !== password2){
                return res.redirect(`register?msg=Err5`);
            }
            const hashEmail = Crypto.hash(email);
            const alreadyEmail = await Redis.get(`user_${hashEmail}`)
            if( alreadyEmail === ''){
                const data = {
                    'email' : email,
                    'id' : hashEmail,
                    'password' : password2
                }

                const userdata = {
                    "email" : email,
                    'sleep' : Random(1000,9000)
                }
                await Redis.rpush("email_list", stringify(userdata));
                await Redis.publish('news1',`register a new user ${email} on ${dateTime.toString()}`)
                Redis.set(`user_${hashEmail}`, data)
                return res.redirect(`register?msg=ok`);
            }else{
            return res.redirect(`register?msg=already_email`);
            }


        }catch(e){
            return super.toError(e,req,res);
        }
    }

    async recovery(req,res){
        try{
            // const result = await this.#loginValidation(req);
            // if(!result.isEmpty()){
            //     return res.send(result?.errors[0].msg);
            // }

            const data = {
                "title" : Translate.t("user.recovery")
            };
            
            return res.render(`user/recovery.html`,data);
        }catch(e){
            return super.toError(e,req,res);
        }
    }
    
    async #recoveryValidation(req){
        await body('email').not().isEmpty().withMessage('Err1')
        .isEmail().withMessage("Err2").run(req);

        return validationResult(req);
    }

  
    
    async postRecovery(req,res){
        try{
            const result = await this.#recoveryValidation(req);
            if(!result.isEmpty()){
                return res.redirect(`?msg=${result?.errors[0]?.msg}`);
            }
            const email = await super.input(req.body.email);
            const hashEmail = Crypto.hash(email);
            const user = await Redis.get(`user_${hashEmail}`);

            if(user?.id){
                const resetkey = await Redis.get(`reset_${hashEmail}`);
                if( resetkey === '' ){
                    const token = Crypto.hash(email + Random(100000000,999999999) + dateTime.getTimeStamp() + Random(100000000,999999999));
                    const data = {
                        'email' : email,
                        "id" : hashEmail,
                        'token' : token
                    };
                    await Redis.set(`reset_${hashEmail}`, data , 60 * 2);
                    return res.redirect(`recovery?msg=ok`);
                }else{ 
                    return res.redirect(`recovery?msg=reset-wait`);
                }
            }else{
                return res.redirect(`recovery?msg=email-error`);
            }


        }catch(e){
            return super.toError(e,req,res);
        }
    }

}


export default new userController();


