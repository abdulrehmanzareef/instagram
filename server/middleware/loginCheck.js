import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/user.js';


export default(req,res,next)=>{
    const {authorization}=req.headers;
    if(!authorization){
        return res.status(401).json({message:"you must login first"})
    }
    const token =authorization.replace("Bearer ","")
    
    jwt.verify(token,"secretKey",(err,payload)=>{
        if(err){
            return res.status(401).json({message:"you must login first"})
        }
        const {_id}=payload
        User.findById(_id).then(
            userdata=>{
                req.user=userdata
                next() 
            }
            
        )
        
    })



}