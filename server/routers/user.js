import express from 'express';
import mongoose from 'mongodb';
import Post from '../models/post.js';
import loginCheck from '../middleware/loginCheck.js';
import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const router=express.Router();

router.get('/user/:id',loginCheck,(req,res)=>{
    
    User.findOne({_id:req.params.id})
    .select("-password")
    .then(user=>{
         Post.find({postedBy:req.params.id})
         .populate("postedBy","_id name")
         .exec((err,posts)=>{
             if(err){
                 return res.status(422).json({error:err})
             }
             res.json({user,posts})
         })
    }).catch(err=>{
        return res.status(404).json({error:"User not found"})
    })
})
router.put('/follow',loginCheck,(req,res)=>{
    User.findByIdAndUpdate(req.body.followId,{
        $push:{followers:req.user._id}
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
      User.findByIdAndUpdate(req.user._id,{
          $push:{following:req.body.followId}
          
      },{new:true}).select("-password").then(result=>{
          res.json(result)
      }).catch(err=>{
          return res.status(422).json({error:err})
      })

    }
    )
})
router.put('/unfollow',loginCheck,(req,res)=>{
    User.findByIdAndUpdate(req.body.unfollowId,{
        $pull:{followers:req.user._id}
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
      User.findByIdAndUpdate(req.user._id,{
          $pull:{following:req.body.unfollowId}
          
      },{new:true}).select("-password").then(result=>{
          res.json(result)
      }).catch(err=>{
          return res.status(422).json({error:err})
      })

    }
    )
})
router.put('/updatepic',loginCheck,(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{$set:{pic:req.body.pic}},{new:true},
        (err,result)=>{
         if(err){
             return res.status(422).json({error:"pic canot post"})
         }
         res.json(result)
    })
})
router.post('/search-users',(req,res)=>{
    let userPattern = new RegExp("^"+req.body.query)
    User.find({email:{$regex:userPattern}})
    .select("_id email  name followers following pic")
    .then(user=>{
        res.json({user})
    }).catch(err=>{
        console.log(err)
    })

})
router.get('/getsfollower',loginCheck,(req,res)=>{

    // if postedBy in following
    User.find({following:{$in:req.user.following}})
    
    .sort('-createdAt -pic -followers -name -_id -email')
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.put('/changename',(req,res)=>{
    const newName = req.body.name
    User.findOne({name:req.body.name})
    .then(savedUser=>{
        if(savedUser){
          return res.status(422).json({error:"This name is already taken. Please try a different one"})
        }
        User.findOne({email:req.body.email})
    .then(user=>{
        if(!user){
            return res.status(422).json({error:"Invalid Credentials"})
        }
        if(newName.length>30){
          return res.status(422).json({error:`Your name must not be having more than 30 characters. You have entered ${newName.length} characters.`})
        }
           user.name = newName
           user.save().then((user)=>{
               res.json({message:"Name changed successfully."})
           })
    }).catch(err=>{
        console.log(err)
    })
    }) 
  })

  
  router.put('/changepassword',loginCheck,(req,res)=>{
    const {password,cpassword}=req.body;
    const email=req.user.email;
    console.log(req.body);
    if( password !== cpassword){
        return res.status(422).json({error:"new and confirm password does't match"})
    }
    User.findOne({email})
    .then((savedUser)=>{
        
        bcrypt.hash(password,12).then(hashedPassword=>{
           
            User.findByIdAndUpdate(req.user._id,{$set:{password:hashedPassword}},{new:true},
                (err,result)=>{
                 if(err){
                     return res.status(422).json({error:"password cannot post"})
                 }
                 res.json(result)
            })
           
        }).catch(err=>{
            console.log(err)
        })
        
    }).catch(err=>{
        console.log(errr)
    })
    
})

export default router;