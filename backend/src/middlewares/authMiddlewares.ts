import jwt from 'jsonwebtoken'
import asyncHandler from "express-async-handler"
import AppError from '../utils/appError.js';
import { HttpStatus } from '../types/HttpStatus.js';

export const userAuthentication=asyncHandler(async(req,res,next)=>{
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if(token){
      const tokenSecret = process.env.JWT_SECRET as string;
      jwt.verify(token, tokenSecret, async (err, payload: any) => {
        try {
          if (err) {
            throw new AppError("UnAuthorized User",HttpStatus.UNAUTHORIZED)
          }
          req.userId = payload.userId;
          next();
        } catch (error) {
          next(error);
        }
      });
    }else{
      throw new AppError("token not found",HttpStatus.UNAUTHORIZED)
    }
})

export const adminAuthentication=asyncHandler(async(req,res,next)=>{
  let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
      if(token){
        const tokenSecret = process.env.JWT_SECRET as string;
        jwt.verify(token, tokenSecret, async (err, payload: any) => {
          try {
            if (err) {
              throw new AppError("UnAuthorized Admin",HttpStatus.UNAUTHORIZED)
            }
            return next();
          } catch (error) {
            next(error);
          }
        });
      }else{
      throw new AppError("token not found",HttpStatus.UNAUTHORIZED)
    }
})

