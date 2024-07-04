import autoBind from "auto-bind"
import {getEnv, log} from './utils.mjs'


export default class BaseContoller{

    constructor(){
        if(this.constructor === BaseContoller ){
            throw new Error("BaseContoller is an abstact class!!")
        }
        autoBind(this);

    }

    toError(error,req ,res){
        const debug = getEnv("DEBUG",'boolean');
        try{
            
            if(debug)
                return res.status(500).send(error.toString());
            else
                return res.status(500).send('internal server Error!!');
        }catch(e){
            if(debug)
                return res.status(500).send(error.toString());
            else
                return res.status(500).send('internal server Error!!');
        }
    }

    errorHandling(error){
        const debug = getEnv("DEBUG",'boolean');
        try{
            return async (req,res,next) =>{
                if(debug)
                    return res.status(500).send(error.toString());
                else
                    return res.status(500).send('internal server Error!!');
            }
        }catch(e){
            throw e;
        }
    }

    async input(param){
        try{
            const r = Array.isArray(param) ? '' : param;
            
                if(typeof r === 'string'){
                    return r;
                }else{
                    return '';
                }
            }catch(e){
                return '';
            }
    }
    
}