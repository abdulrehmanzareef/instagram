import React,{useState,useEffect} from 'react'
import {Link,useHistory} from 'react-router-dom'
import M from 'materialize-css'
import FileBase from 'react-file-base64';

function CreatePost() {
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [image, setImeage] = useState("")
    const [url, setUrl] = useState("")
    const history = useHistory()
    useEffect(() => {
        if(url){
            fetch("/createpost",{
                method:"post",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer "+localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    title,
                    body,
                    photo:url
                })
            }).then(res=>res.json()
            .then(data=>{
            
                if(data.error){
                    M.toast({html: data.error,classes:"#c62828 red darken-3"})
                 }
                 else{
                     M.toast({html:"posted successfully",classes:"#43a047 green darken-1"})
                     history.push('/')
                 }
            }).catch(err=>{
                console.log(err)
            })
            ).catch(err=>{
                console.log(err)
            })

        }
    }, [url])
    const PostData=()=>{
        const data=new FormData()
        data.append("file",image)
        data.append("upload_preset","instgram-clone")
        data.append("cloud_name","instgramc")
        fetch("https://api.cloudinary.com/v1_1/instagramc/image/upload",{
            method:"post",
            body:data
        }).then(res=>res.json())
        .then(data=>{
            setUrl(data.url)
            
        }).catch(err=>{
            console.log(err)
        })
        
        
    }
    return (
        <div className="card input-filed" style={{margin:"30px auto" ,maxWidth:"500px",padding:"20px",textAlign:"center"}}>
        <h2>Enstantgram</h2>
        <h6 style={{color:"green"}}><strong>Create a New Post</strong></h6>
            <input type="text" placeholder="title"
                value={title} onChange={(e)=>setTitle(e.target.value)}
            />
            <input type="text" placeholder="body"
                value={body} onChange={(e)=>setBody(e.target.value)}
            />
            <div className="file-field input-field">
                <div className="btn #64b5f6 blue darken-1">
                {/* <span>Upload imeage</span><FileBase type="file" multiple={false} onDone={({ base64 }) => setImeage({  photo: base64 })} /> */}
                    <span>Upload imeage</span>
                    <input type="file" onChange={(e)=>setImeage(e.target.files[0])}/>
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text"/>
                </div>
            </div>
            <button onClick={()=>PostData()} className="btn waves-effect waves-light #64b5f6 green darken-1">
                Submit
            </button>
        </div>
    )
}

export default CreatePost
