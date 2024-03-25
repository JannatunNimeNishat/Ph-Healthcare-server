import { NextFunction, Request, Response } from "express";
import { jwtHelpers } from "../../helpers/jwtHelpers";
import config from "../../config";
import { Secret } from "jsonwebtoken";

const auth = (...roles:string[])=>{
    return async(req:Request,res:Response,next:NextFunction) =>{
        try {
            const token  = req.headers.authorization;
            if(!token){
                throw new Error('You are not authorized!');
            }
            const inComingDecodedTokenData = jwtHelpers.verifyToken(token, config.jwt.jwt_secret as Secret);
    
            if(roles.length && !roles.includes(inComingDecodedTokenData?.role)){
                throw new Error('You are not authorized!');
            }
            next();
        } catch (error) {
            next(error)
        }

    }
}

export default auth;