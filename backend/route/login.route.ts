import { Router } from "express";
const router: Router = Router();

import { login} from '../controller/login.controller';

import { basicAuthUser } from '../middleware/basicAuth';

router.post('/', 
    basicAuthUser, 
    login
);



export default router;
