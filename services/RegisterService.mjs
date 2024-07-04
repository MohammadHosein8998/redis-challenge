import { log, getEnv, sleep, stringify, toJSON } from "../core/utils.mjs";
import Redis from "../core/redis.mjs";

class RegisterService{
    #redis = null;
    constructor(){
        log("RegisterService is start ...");
    }


    async run(){
        try{
            this.#redis = new Redis();;
            log('aplication is running!!');
            const rediStatus = await this.#redis.connect(getEnv('REDIS_URI'));
            if(!rediStatus){
                log("redis can not connect!");
                process.exit(-1);
            };
            
            await this.#redis.subscribe('news1',(err, count) => {
                if(err){
                    log(`subsccribe ERROR : ${err.toString()}`);
                }else{
                    log(`subscribed ssuccessfully in ${count} channel`)
                }
            })
            this.#redis.on('message', (channel, message) => {
                log(`channel => ${channel}`);
                log(`message => ${message}`);
            })


        }catch(e){
            log(`RegisterService Running Error : ${e.toString()}`)
        }
    }

    
    async loop(){
        try{
            const item = await this.#redis.lpop("email_list");
            const userdata = toJSON(item)
            if(item){
                log(userdata);
                await sleep(userdata?.sleep);
                log(`send email to ${userdata?.email}`)
            }
        }catch(e){
            log(`Loop Error : ${e.toString()}`);
        }
    }
}



async function main(){
    try{
        const obj = new RegisterService();
        await obj.run();
    }catch(e){
        log(`MialService Error : ${e.toString()}`)
    }
}

await main();