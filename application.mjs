import { log,getEnv,sleep,Random } from "./core/utils.mjs";
import express from "express";
import fileUpload from 'express-fileupload'
import route from "./routes/route.mjs";
import nunjucks from 'nunjucks';
import Error500 from "./controllers/Error500Controller.mjs";
import Error404 from "./controllers/Error404Controller.mjs";
import Translate from "./core/Translate.mjs";
import * as fs from './core/fs.mjs';
import Crypto from "./core/Crypto.mjs";
import dateTime from "./core/dateTime.mjs";
import {Redis} from "./global.mjs";
import  * as TemplateHelper from './core/templateHelper.mjs';








class application{

    #app = null;
    #templateEngine = null;
    
    constructor(){
        this.#initExpress();
        this.#initRoute();
    }
    async #initExpress(){
        try{
            log('Express is running!!');
            this.#app = express();
            this.#app.use(express.static('assets'));
            this.#app.use(express.static('media'));
            this.#app.use(express.urlencoded({extended : true , limit : '10mb'}));
            this.#app.use(express.urlencoded({ limit : '10mb'}));
            this.#app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/'
            }));

            this.#app.use(async (req,res,next) =>{
                try{
                    this.#app.set('req' , req);
                    next();
                }catch(e){
                    next();
                }
            })
            this.#initTemplateEngin();
        }catch(e){
            log(`Error in Express : ${e.toString()}`);
        }
    }

    async #initRoute(){
            try{
                
                this.#app.use('/', route);
                this.#app.use(Error404.handle);
                this.#app.use(Error500.handle);
            }catch(e){
                log(`Error in Route : ${e.toString()}`);                
            }

    }
    
    #initTemplateEngin(){
        try{
            const templateDir = 'templates/' + getEnv('TEMPLATE') + '/';
            const Template_NAME = getEnv('URL')  + getEnv('TEMPLATE') + '/';
            this.#templateEngine = nunjucks.configure(templateDir,{
            autoescape : false,
            express : this.#app,
            noCache : false     
            });
            this.#templateEngine.addGlobal('t',Translate.t);
            this.#templateEngine.addGlobal('URL', getEnv('URL'));
            this.#templateEngine.addGlobal('Template_NAME', Template_NAME )
            this.#templateEngine.addExtension('alertDangerExtention', new TemplateHelper.alertDangerExtention())
            this.#templateEngine.addExtension('AlertSuccess', new TemplateHelper.alertSuccessExtention())
            
        }catch(e){
            log(`Error in initTemplateEngin : ${e.toString()}`);                
        }
    }

    async run(){
        try{
            log('aplication is running!!');
        
            const rediStatus = await Redis.connect(getEnv('REDIS_URI'));
            if(!rediStatus){
                log("redis can not connect!");
                process.exit(-1);
            };
            const PORT = getEnv('PORT','number');
            this.#app.listen(PORT, () => {
                log(`app listening on port ${PORT}`);
              })            
        }catch(e){
            log(`Error in Run : ${e.toString()}`);
        }
    }

    

}

export default new application();