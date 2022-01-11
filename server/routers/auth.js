import express from 'express'
import mongoose from 'mongoose';
import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import loginCheck from '../middleware/loginCheck.js'

const router=express.Router();

router.get('/protected',loginCheck,(req,res)=>{
    res.send("heloo jnb")
})
router.post('/signup',(req,res)=>{
    const {name,email,password,pic}=req.body;
    if(!name || !password || !email){
        return res.status(422).json({error:"please fill all the fields"})
    }
    User.findOne({email})
    .then((savedUser)=>{
        if(savedUser){
            return res.json({error:"User already exixt with this email"})
        }
        bcrypt.hash(password,12).then(hashedPassword=>{
            const user=new User({
                name,
                email,
                password:hashedPassword,
                pic
            })
            user.save().then(user=>{
                return res.json({message:"User added successfully"})
            }).catch(err=>{
                console.log(errr)
            })
        }).catch(err=>{
            console.log(err)
        })
        
    }).catch(err=>{
        console.log(errr)
    })
    
})


router.post('/signin',(req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
       return res.status(422).json({error:"please add email or password"})
    }
    User.findOne({email})
    .then(savedUser=>{
        if(!savedUser){
           return res.status(422).json({error:"Invalid Email or password"})
        }
       
        bcrypt.compare(password,savedUser.password)
        .then(match=>{
          
            if(match){
          
              const token=jwt.sign({_id:savedUser._id},"secretKey");
              const {_id,name,email,followers,following,pic} = savedUser
               res.json({token,user:{_id,name,email,followers,following,pic}})
            
                
               
            }
            else{
              return res.status(422).json({error:"Invalid Email or password"})
            }
        })
        .catch(err=>{
            console.log(err)
        })
    })
  })
export default router;