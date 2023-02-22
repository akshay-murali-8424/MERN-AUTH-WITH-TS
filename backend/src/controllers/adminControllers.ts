import bcrypt from "bcryptjs"
import asyncHandler from "express-async-handler"
import jwt from "jsonwebtoken"
import AppError from "../utils/appError.js"
import Admin from "../models/adminModel.js"
import User from "../models/userModel.js"
import { Request, Response } from "express"
import AdminInterface from "../types/AdminInterface.js"
import UserInterface from "../types/UserInterface.js"
import { HttpStatus } from "../types/HttpStatus.js"

export const verifyLogin = asyncHandler(async (req:Request, res:Response) => {
    const { email, password }: {email:string,password:string}= req.body;
    const admin:AdminInterface | null = await Admin.findOne({ email });
    if (!admin) {
        throw new AppError("invalid credentials", HttpStatus.UNAUTHORIZED);
    }
    const isPasswordCorrect:boolean = await bcrypt.compare(password, admin.password);
    if (!isPasswordCorrect) {
        throw new AppError("invalid credentials", HttpStatus.UNAUTHORIZED)
    }
    const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET as string, {
        expiresIn: "2d",
    });
    res.json({
        status: "success",
        message: "admin verified",
        token,
    })
})

export const getAllUsers = asyncHandler(async(req:Request,res:Response)=>{
    const users:UserInterface[]= await User.find({})
    res.json({
        status:"success",
        users
    })
   
})

export const addNewUser = asyncHandler(async (req:Request, res:Response) => {
    let { name, email, password } : {name:string, email:string, password:string} = req.body;
    email = email.toLowerCase()
    const isExistingEmail:UserInterface | null = await User.findOne({ email })
    if (isExistingEmail) {
        throw new AppError("existing email", HttpStatus.UNAUTHORIZED)
    }
    const salt = await bcrypt.genSalt(10);
    // hashing password
    password = await bcrypt.hash(password, salt);
    await User.create({ name, email, password })
    res.json({
        status:"success",
        message:"new user added"
    })
})

export const editUser = asyncHandler(async(req:Request,res:Response)=>{
    const userId=req.params.id
    let {name,email}:{name:string,email:string}=req.body;
    email = email.toLowerCase();
    const isExistingEmail:UserInterface | null = await User.findOne({ email })
    const user:UserInterface | null = await User.findById(userId)
    if (isExistingEmail&&user?.email!=email) {
        throw new AppError("existing email", HttpStatus.UNAUTHORIZED)
    }
    await User.findByIdAndUpdate(userId, { $set: { name, email }});
    res.json({
        status:"success",
        message:"user details modified"
    })
})

export const deleteUser = asyncHandler(async(req:Request,res:Response)=>{
    const userId = req.params.id;
    await User.findByIdAndDelete(userId)
    res.json({
        status:"success",
        message:"user deleted"
    })
})