import React,{useEffect,useState,useContext} from 'react'
import {useHistory,Link} from 'react-router-dom'
import {UserContext} from '../App'
import M from 'materialize-css'
import {Fragment} from 'react';
import moment from 'moment'
import '../App.css';
// import GoToTop from './ScrollToTop';

const Profile  = ()=>{
    const [mypics,setPics] = useState([])
    const {state,dispatch} = useContext(UserContext)
    const history=useHistory()
    const [view,setView] = useState(false);
    const [data,setData] = useState([])
    const scrollToTop = () => {
        window.scrollTo({top:0, behavior:"smooth" })
    }
    
    const [image,setImage] = useState("")
    useEffect(()=>{
        fetch('/mypost',{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            
            
            setData(result.mypost)
        })
     },[])
     
     const likePost = (id)=>{
      
         fetch('/like',{
             method:"put",
             headers:{
                 "Content-Type":"application/json",
                 "Authorization":"Bearer "+localStorage.getItem("jwt")
             },
             body:JSON.stringify({
                 postId:id
             })
         }).then(res=>res.json())
         .then(result=>{
                   
           const newData = data.map(item=>{
               if(item._id===result._id){
                 
                   return result
               }else{
                
                   return item
               }
           })
           setData(newData)
         })
         .catch(err=>{
             console.log(err)
         })
   }
   const unLikePost = (id)=>{
     fetch('/unlike',{
         method:"put",
         headers:{
             "Content-Type":"application/json",
             "Authorization":"Bearer "+localStorage.getItem("jwt")
         },
         body:JSON.stringify({
             postId:id
         })
     }).then(res=>res.json())
     .then(result=>{
     
       const newData = data.map(item=>{
           if(item._id==result._id){
               return result
           }else{
               return item
           }
       })
       console.log("new data"+newData)
       setData(newData)
     }).catch(err=>{
       console.log(err)
   })
 }
 const makeComment = (text,postId)=>{
     fetch('/comment',{
         method:"put",
         headers:{
             "Content-Type":"application/json",
             "Authorization":"Bearer "+localStorage.getItem("jwt")
         },
         body:JSON.stringify({
             postId,
             text
         })
     }).then(res=>res.json())
     .then(result=>{
     
         const newData = data.map(item=>{
           if(item._id==result._id){
               return result
           }else{
               return item
           }
        })
       setData(newData)
     }).catch(err=>{
         console.log(err)
     })
 }
 const deletePost = (postid)=>{
    
     fetch(`/deletepost/${postid}`,{
         method:"delete",
         headers:{
             Authorization:"Bearer "+localStorage.getItem("jwt")
         }
     }).then(res=>res.json())
     .then(result=>{
       
         const newData = data.filter(item=>{
             return item._id !== result._id
         })
         setData(newData)
     })
 }

 const deleteComment = (postid, commentid) => {
   
    fetch(`/deletecomment/${postid}/${commentid}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
             const newData = data.map((item) => {

          if (item._id == result._id) {
                     return result;
          } else {
            return item;
          }
        });
        const newData1 = mypics.map((item) => {

            if (item._id == result._id) {
                       return result;
            } else {
              return item;
            }
          });
        setData(newData);
        setPics(newData1)
      }).then(result=>{
        M.toast({html:"Comment Deleted Successfully",classes:"#43a047 green darken-1"})
    })
  };
  useEffect(()=>{
    if(image){
     const data=new FormData()
     data.append("file",image)
     data.append("upload_preset","instgram-clone")
     data.append("cloud_name","instgramc")
     fetch("https://api.cloudinary.com/v1_1/instagramc/image/upload",{
         method:"post",
         body:data
     })
     .then(res=>res.json())
     .then(data=>{
 
    
        fetch('/updatepic',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                pic:data.url
            })
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}))
            dispatch({type:"UPDATEPIC",payload:result.pic})
            //window.location.reload()
        })
    
     })
     .catch(err=>{
         console.log(err)
     })
    }
 },[image])
 const updatePhoto = (file)=>{
     setImage(file)
 }
//  console.log(mypics)
   return (
       <div style={{maxWidth:"550px",margin:"0px auto"}}>
           <div style={{
              margin:"18px 0px",
               borderBottom:"1px solid grey"
           }}>

         
           <div style={{
               display:"flex",
               justifyContent:"space-around",
              
           }}>
               <div>
                   <img style={{width:"160px",height:"160px",borderRadius:"80px"}}
                   src={state?state.pic:"loading"}
                   />
                 
               </div>
               <div>
               {/* {console.log(data.length)} */}
                   <h4>{state?state.name:"loading"}</h4>
                   <h5>{state?state.email:"loading"}</h5>
                   <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
                       <h6><strong>{data.length} </strong>posts</h6>&nbsp;&nbsp;&nbsp;&nbsp;
                       <h6><strong>{state?state.followers.length:"0"} </strong>followers</h6>&nbsp;&nbsp;&nbsp;&nbsp;
                       <h6><strong>{state?state.following.length:"0"}</strong> following</h6>
                   </div>

               </div>
               <Link to="/changename">
                <button className="btn  #c62828 blue ">
                  <i class="fas fa-edit edit-icon1"></i> Change Name
                </button></Link>
           </div>
           <Link to="/changepassword">
                <button className="btn  #c62828  ">
                  <i class="fas fa-edit edit-icon1"></i> password
                </button></Link>
      
            <div className="file-field input-field" style={{margin:"10px"}}>
            <div className="btn #64b5f6 green darken-1">
                <span>Update pic</span>
                <input type="file" onChange={(e)=>updatePhoto(e.target.files[0])} />
            </div>
            <div className="file-path-wrapper">
                <input className="file-path validate" type="text" />
            </div>
            </div>
            </div>   
            
            <div className="adjust">
              <span onClick={()=> setView(false)} style={{ marginBottom:"10px", marginRight:"10px" }} className="btn orange text-white">Posts</span>
              <span onClick={()=> setView(true)} style={{ marginBottom:"10px", marginRight:"10px" }} className="btn purple text-white">Gallery</span>
            </div> 
            {
                
                  view 
                  ? <div className="gallery">
                  {
                      
                   data ?  
                   data.map(item=>{
                          return(
                           <img key={item._id} className="item" src={item.photo} alt={item.title}/>  
                          )
                      }) 
                      :
                   <h3 style={{ fontFamily:"Grand Hotel, cursive" }}>No Posts published yet</h3>
                  }</div>
                  : <Fragment>
                  {
                    data ?  data.map(item=>{
                       
                      return(
                         
                        <div className="card home-card" key={item._id}>
                <div style={{ position:"relative" }}>
          <img className="setting" src={item.postedBy.pic} atl="logo"/>
                <h5 style={{padding:"-2px"}}>
       <Link  className="link-setting" to={item.postedBy._id !== state._id?"/profile/"+item.postedBy._id :"/profile"}>{item.postedBy.name}</Link> 
                            {item.postedBy._id == state._id 
                            && <i className="material-icons img11" style={{color:"red"}}
                            onClick={()=>{
                                deletePost(item._id);
                            } }
                            >delete</i>

                            }</h5></div>
                            <div className="card-image mar">
                                <img style={{maxHeight:"500px"}} src={item.photo}/>
                            </div>
                            <div className="card-content">
                            
                            {item.likes.includes(state._id)
                   ?<i className="material-icons"
                    onClick={()=>{unLikePost(item._id)}}
                    ><i className="material-icons" style={{color:"red"}}>favorite</i>  thumb_down </i>:<i className="material-icons"
                     onClick={()=>{likePost(item._id)}}
                     >favorite_border  thumb_up  </i>
                   }
                            
                           
                            <h6><strong>{item.likes.length} likes &nbsp;{item.comments.length} comments</strong></h6>
    
      <h6><strong><Link  to={item.postedBy._id !== state._id?"/profile/"+item.postedBy._id :"/profile"  }>{item.postedBy.name }</Link> </strong>
      &nbsp;{item.body}</h6>
      {item.comments.length==0?<h6><strong>No comments yet..</strong></h6>:item.comments.length===1?<h6><strong>View 1 comment</strong></h6>:
        <h6><strong>View all {item.comments.length} comments</strong></h6>}              
                                {
                                    item.comments.map(record=>{
                                        return(
                                      
                                        <h6 key={record._id}>
                                        <span style={{ fontWeight: "500" }}>
<Link  to={record.postedBy._id !== state._id?"/profile/"+record.postedBy._id :"/profile"  }>{record.postedBy.name}</Link>  
                                        </span>{" "}
                                        {record.text}
        { (item.postedBy._id===state._id  || record.postedBy._id===state._id)
            
                             && (
                                          <i
                                            className="material-icons"
                                            style={{
                                              float: "right",color:"red",
                                            }}
                                            onClick={() => deleteComment(item._id, record._id)}
                                          >
                                            delete
                                          </i>
                                        )}
                                      </h6>
                                        )
                                    })
                                }
                                <form onSubmit={(e)=>{
                                    e.preventDefault()
                                    makeComment(e.target[0].value,item._id)
                                    e.target[0].value=""
                                }}>
                                  <input type="text" placeholder="add a comment" />  
                                </form>
                                <p><strong>Posted on {moment(item.date).format('MMMM Do YYYY')}</strong>
                                <span style={{float:"right"}}><strong>{moment(item.createdAt).fromNow()}</strong></span>
                                
                                </p>
                            </div>
                        </div>
                      ) 
                    }) : <h3 className="adu">No Posts published yet</h3>
                  }
                    </Fragment>
              }    
           {/* <div className="gallery">
               {
                   mypics.map(item=>{
                       return(
                        <img key={item._id} className="item" src={item.photo} alt={item.title}/>  
                       )
                   })
               }

           
           </div> */}
         
       </div>
   )
}


export default Profile