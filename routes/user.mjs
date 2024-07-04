
import { Router } from "express";
import userController from "../controllers/userController.mjs";

const route = Router();


try{
    route.get("/" , userController.index);
    route.post("/" , userController.postLogin);
    route.get("/register" , userController.register);
    route.post("/register" , userController.postRegister);
    route.get("/recovery" , userController.recovery);
    route.post("/recovery" , userController.postRecovery);

}catch(e){
    route.use(userController.errorHandling(e.toString()));
}

export default route;


