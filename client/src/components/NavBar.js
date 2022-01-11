import React,{useContext,useRef,useEffect,useState} from 'react'
import {Link ,useHistory} from 'react-router-dom'
import {UserContext} from '../App.js'
import styled from 'styled-components'
import M from 'materialize-css'
import {GrClose} from 'react-icons/gr';
const StyledButton = styled.button`
    font-size: 1.7rem;
`
//@mehakzahir190063
const NavBar = ()=>{
  const {state,dispatch} = useContext(UserContext)
  
    const  searchModal = useRef(null)
    const [search,setSearch] = useState('')
    const [userDetails,setUserDetails] = useState([])
  const history=useHistory()

  useEffect(()=>{
    M.Modal.init(searchModal.current)
},[])
  const render=()=>{
   
    if(state){
      return [
        <li key="1"><i  data-target="modal1" className="large material-icons modal-trigger" style={{color:"black"}}>search</i></li>,
        <li key="9"><Link to="/"> <i className="material-icons" >home</i></Link></li>,
        <li key="2"><Link to="/profile">Profile</Link></li>,
        
        <li key="3"><Link to="/create">create Post</Link></li>,
        <li key="4"><Link to="/myfollowingpost">My following Posts</Link></li>,
        <li key="5">
    <button  onClick={()=>{
      console.log("logout")
              localStorage.clear()
              history.push('/login')
              dispatch({type:"LOGOUT"})
              
             
            }} className="btn #c62828 red darken-3">
                   Logout
               </button>
        </li>
      ]
    }
    else {
      return [
        <li key="7"><Link to="/login">Login</Link></li>,
        <li key="8"><Link to="/signup">Signup</Link></li>
      ]
    }
  }
  const fetchUsers = (query)=>{
    setSearch(query)
    fetch('/search-users',{
      method:"post",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        query
      })
    }).then(res=>res.json())
    .then(results=>{
      setUserDetails(results.user)
    })
 }
    return (
        <div>
            <nav>
    <div className="nav-wrapper green ">
      <Link to={state?"/":"/login"} className="brand-logo left"  ><span style={{color:"black"}}><strong>Enstantgram</strong></span> </Link>
      <ul id="nav-mobile" className="right hide-on-med-and-down">
       {render()}
       
      </ul>
    </div>
    <div id="modal1" class="modal style-width" ref={searchModal} style={{color:"black"}}>
          <div className="modal-footer">
          <StyledButton className="modal-close waves-effect waves-white btn-flat right" onClick={()=>setSearch('')}><GrClose /></StyledButton>
          </div>
          <div className="modal-content">
          <input
            type="text"
            placeholder="Search users"
            value={search}
            onChange={(e)=>fetchUsers(e.target.value)}
            />
           {
               userDetails && userDetails.length>0
               ?
                <ul className="collection">
             {userDetails.map(item=>{
              return (
                 <Link to={item._id !== state._id ? "/profile/"+item._id:'/profile'} onClick={()=>{
                  M.Modal.getInstance(searchModal.current).close()
                  setSearch('')
                }}><li className="collection-item">
                <img className="search-image" src={item.pic} alt={item._id}/>
                <span className="search-user">{item.name}</span>
                <span className="search-email">{item.email}</span>
                </li></Link> 
              ) 
            })}
              </ul> : <ul>No result found</ul>
           } 
          </div>
          </div>
    
  </nav>
  
        </div>
    )
}

export default NavBar
