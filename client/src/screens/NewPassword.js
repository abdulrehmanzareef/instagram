import React,{useState,useContext} from 'react'
import {Link,useHistory} from 'react-router-dom'
import {UserContext} from '../App'
import M from 'materialize-css'
const SignIn  = ()=>{
    const history = useHistory()
    const {state,dispatch} = useContext(UserContext)
    
    const [password,setPasword] = useState("")
    const [cpassword,setcPasword] = useState("")
   
    
   
   
    const PostData = ()=>{
      console.log(password)
      console.log(cpassword)
      fetch('/changepassword',{
        method:"put",
        headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("jwt")
        },
        body:JSON.stringify({
            password,
            cpassword
        })
    }).then(res=>res.json())
    .then(data=>{
        console.log(data)
        
            if(data.error){
               M.toast({html: data.error,classes:"#c62828 red darken-3"})
            }
            else{
                M.toast({html:"password changes successfully",classes:"#43a047 green darken-1"})
                localStorage.clear()
                dispatch({type:"LOGOUT"})
                history.push('/login')
                M.toast({html: "Sign in again to confirm it was you.",classes:"#43a047 green darken-1"})
            }
         }).catch(err=>{
             console.log(err)
         })
       
    }

   return (
      <div className="mycard">
          <div className="card auth-card input-field">
            <h2>Enstantgram </h2>
           
            <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e)=>setPasword(e.target.value)}
            />
            <input
            type="password"
            placeholder="confirm new password"
            value={cpassword}
            onChange={(e)=>setcPasword(e.target.value)}
            />
          
            <button className="btn waves-effect waves-light #64b5f6 green darken-1"
            onClick={()=>PostData()}
            >
                Change Password
            </button>
            
         
            
    
        </div>
      </div>
   )
}


export default SignIn