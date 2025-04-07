import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();

declare module "express-serve-static-core" {
    interface Request {
        userData?: JwtPayload | string;
    }
}


interface TokenData {
    id: string;
    email: string;
}

export const CreateJWTToken = (data: TokenData): string => {
    return jwt.sign(data, process.env.jwtSecretKey as string, { expiresIn: "1h" });
};

export const checkSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers["token"];

    if (!authHeader || typeof authHeader !== "string" || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "Unauthorized: Missing or invalid token format" });
        return;
      }

    const token = authHeader.split(" ")[1];

    try {
        const decodedToken = jwt.verify(token, process.env.jwtSecretKey as string) as JwtPayload;
        req.userData = decodedToken;
        next();
    } catch (err) {
        res.status(401).json({ result: err, message: "Unauthorized: Invalid token" });
    }
};
