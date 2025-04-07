import { Router } from "express";
const router: Router = Router();

import { register, getAllUsers, getSingleUser } from '../controller/user.controller';
import { checkQuery } from '../middleware/validators';
import { checkSession } from '../middleware/tokenManager';
import { basicAuthUser } from '../middleware/basicAuth';

router.post('/register', 
    basicAuthUser, 
    register
);

router.get('/', 
    basicAuthUser,  
    checkSession,  
    getAllUsers     
);

router.get('/singleUser',
    basicAuthUser,
    checkQuery('_id'),
    checkSession,   
    getSingleUser
);

export default router;
