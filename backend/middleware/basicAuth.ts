import auth from 'basic-auth';
import { Request, Response, NextFunction } from "express";

export const basicAuthUser = function (req: Request, res: Response, next: NextFunction): void {
    const credentials = auth(req);
    console.log('credentials', credentials);

    if (!credentials || credentials.name !== process.env.basicAuthUser || credentials.pass !== process.env.basicAuthKey) {
        res.setHeader('WWW-Authenticate', 'Basic realm="example"');
        res.status(401).json({
            success: false,
            statusCode: 499,
            message: 'Unauthorized',
        });
        return; 
    } 

    next(); 
};

