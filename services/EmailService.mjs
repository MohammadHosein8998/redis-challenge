import { log, getEnv, sleep, stringify, toJSON } from "../core/utils.mjs";
import Redis from "../core/redis.mjs";

class EmailService{
    #redis = null;
    #redis2 = null;

    constructor(){
        log("EmailService is start ...");
    }


    async run(){
        try{
            this.#redis = new Redis();
            this.#redis2 = new Redis();

            log('aplication is running!!');
            const rediStatus = await this.#redis.connect(getEnv('REDIS_URI'));
            if(!rediStatus){
                log("redis can not connect!");
                process.exit(-1);
            };

            const rediStatus2 = await this.#redis2.connect(getEnv('REDIS_URI'));
            if(!rediStatus2){
                log("redis2 can not connect!");
                process.exit(-1);
            };
            
            // log('loop is call!!');
            // await this.loop();

            //"__keyspace@0__:email_list"
            await this.#redis.subscribe("__keyspace@0__:email_list",(err, count) => {
                if(err){
                    log(`subsccribe ERROR : ${err.toString()}`);
                }else{
                    log(`subscribed ssuccessfully in ${count} channel`);
                }
            });

            this.#redis.on('message',async (channel, message) => {
               try{
                   if(message == "rpush"){
                       log(`channel => ${channel}`);
                       log(`message => ${message}`);
                       const item = await this.#redis2.lpop("email_list");
                        const userdata = toJSON(item);
                        
                        if(item){
                            log(userdata);
                            await sleep(userdata?.sleep);
                            log(`send email to ${userdata?.email}`)
                        }
                    }
               }catch(e){
                    log(`redis on Error : ${e.toString()}`);
               }
            });

        }catch(e){
            log(`MialService Running Error : ${e.toString()}`)
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
            await this.loop()
        }catch(e){
            log(`Loop Error : ${e.toString()}`);
        }
    }
}



async function main(){
    try{
        const obj = new EmailService();
        await obj.run();
    }catch(e){
        log(`MialService Error : ${e.toString()}`)
    }
}

await main();