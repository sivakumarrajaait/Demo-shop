import { Router } from "express";
const router: Router = Router();

import { 
    saveProduct, 
    getAllProducts, 
    getSingleProduct, 
    updateProduct, 
    deleteProduct,
    filterProducts
} from '../controller/product.controller';

import { checkQuery, checkRequestBodyParams } from '../middleware/validators';
import { checkSession } from '../middleware/tokenManager';
import { basicAuthUser } from '../middleware/basicAuth';

router.post('/', basicAuthUser,checkSession,saveProduct);

router.get('/', basicAuthUser, checkSession, getAllProducts);

router.get('/singleProduct', 
    basicAuthUser, 
    checkQuery('_id'), 
    checkSession, 
    getSingleProduct
);

router.put('/', 
    basicAuthUser, 
    checkRequestBodyParams('_id'), 
    checkSession, 
    updateProduct
);

router.delete('/', 
    basicAuthUser, 
    checkQuery('_id'), 
    checkSession, 
    deleteProduct
);
router.get('/filter',
 basicAuthUser, 
 checkQuery('name'), 
 checkQuery('createdOn'), 
 checkQuery('stock'),
//  checkSession, 
 filterProducts
);

export default router;
