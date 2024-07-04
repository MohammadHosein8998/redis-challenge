import { Router } from "express";
import userRoute from './user.mjs';
import testRoure from './test.mjs';




const route = Router();

route.use('/' , userRoute);



export default route;


