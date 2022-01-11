import express from 'express';
import mongoose from 'mongodb';
import Post from '../models/post.js';
import loginCheck from '../middleware/loginCheck.js';


const router =express.Router();

router.get('/allpost',loginCheck,(req,res)=>{
    
    Post.find()
    .populate("postedBy","_id name name pic followers following")
    .populate("comments.postedBy","_id name name")
    .populate("comments.postedBy","_id name pic name")
    .populate("postedBy","_id name name pic")
    .sort('-createdAt')
    .sort('-createdAt')
    .then((posts)=>{
        res.json({posts})
    }).catch(err=>{
        console.log(err)
    })
    
})

router.post('/createpost',loginCheck,(req,res)=>{
    const {title,body,photo}=req.body;
   
    if(!title || !body || !photo){
        return res.status(422).json({error:"please fill all the fields"})
    }
    req.user.password=undefined;
    const post=new Post({
        title,
        body,
        photo,
        
        postedBy:req.user
    })
    post.save().then(result=>{
        return res.json({post:result})
    }).catch(err=>{
        console.log(err)
    })
    
})

router.put('/like',loginCheck,(req,res)=>{

    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
    },{
        new:true
    }).populate("postedBy","_id name pic ")
    .populate("comments.postedBy","_id name ")
    .sort('-createdAt').exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})
router.put('/unlike',loginCheck,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{
        new:true
    }).populate("postedBy","_id name pic")
    .populate("comments.postedBy","_id name ")
    .sort('-createdAt').exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.put('/comment',loginCheck,(req,res)=>{
    const comment = {
        text:req.body.text,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    })
    .populate("comments.postedBy","_id name")
    .populate("postedBy","_id name pic")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})
router.delete('/deletepost/:postId',loginCheck,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((err,post)=>{
        if(err || !post){
            return res.status(422).json({error:err})
        }
        if(post.postedBy._id.toString() === req.user._id.toString()){
              post.remove()
              .then(result=>{
                  res.json(result)
              }).catch(err=>{
                  console.log(err)
              })
        }
    })
})
router.get('/getsubpost',loginCheck,(req,res)=>{

    // if postedBy in following
    Post.find({postedBy:{$in:req.user.following}})
    .populate("postedBy","_id name pic")
    .populate("comments.postedBy","_id name")
    .sort('-createdAt')
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.get('/mypost',loginCheck,(req,res)=>{
    Post.find({postedBy:req.user._id})
    .populate("postedBy","_id name pic ")
    .populate("comments.postedBy","_id name")
    .then(mypost=>{
        res.json({mypost})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.delete("/deletecomment/:id/:comment_id", loginCheck, (req, res) => {
    const comment = { _id: req.params.comment_id };
    Post.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { comments: comment },
      },
      {
        new: true, 
      }
    )
      .populate("comments.postedBy", "_id name pic")
      .populate("postedBy", "_id name pic")
      .exec((err, postComment) => {
        if (err || !postComment) {
          return res.status(422).json({ error: err });
        } else {
         
          const result = postComment;
          res.json(result);
        }
      });
  });

export default router;

