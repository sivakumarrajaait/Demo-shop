import { body, param, query } from 'express-validator';


export const checkQuery = (id: string) => {
    return query(id, 'Missing Query').isLength({ min: 1 }).trim().exists();
};

export const checkParam = (id: string) => {
    return param(id, 'Missing Params').isLength({ min: 1 }).trim().exists();
};

export const checkRequestBodyParams = (val: string) => {
    return body(val, 'Missing Body Params').isLength({ min: 1 }).trim().exists().withMessage('Missing Body Params');
};


export default { checkQuery, checkParam, checkRequestBodyParams };
