import express from 'express';

import mongoose from 'mongoose';
import authRouter from './routers/auth.js'
import postRouter from './routers/post.js';
import userRouter from './routers/user.js'

const PORT=process.env.PORT || 5000;

const app=express();
app.use(express.json());
app.use('/',authRouter);
app.use('/',postRouter);
app.use('/',userRouter);



mongoose.connect("mongodb+srv://Mehak:O18nBcIPWPupWVYw@cluster0.nk5jq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
{ useNewUrlParser: true,
    useUnifiedTopology: true,
    useUnifiedTopology:true, 
    useFindAndModify:false})
.then(
    ()=> app.listen(PORT,()=>console.log(`successfull Server running on PORT ${PORT}`)))
    .catch((err)=>console.log(err));
    mongoose.set('useFindAndModify', false);