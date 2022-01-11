import React,{useEffect,createContext, useReducer,useContext} from 'react'
import NavBar from './components/NavBar'
import './App.css';
import {BrowserRouter,Route,Switch,useHistory} from 'react-router-dom';
import Home from './screens/Home'
import Profile from './screens/Profile'
import Signup from './screens/Signup'
import Login from './screens/Login'
import CreatePost from './screens/CreatePost'
import { reducer,initialState } from './reducers/userReducer';
import UserProfile from './screens/UserProfile'
import SubscribedPosts from './screens/SubscribedPosts'
import ChangeUsername from './screens/Change-name';
import NewPassword from './screens/NewPassword'

export  const UserContext=createContext()

const Routing=()=>{
    const history=useHistory()
    const {state,dispatch}=useContext(UserContext)
    
    useEffect(()=>{
        const user=JSON.parse(localStorage.getItem("user"))
        if(user){
            dispatch({type:"USER",payload:user})
            
        }
        else{
            history.push('/login')
        }

    },[])
    return(
        <Switch>
<Route path='/' exact><Home></Home></Route>
            <Route path='/signup' exact><Signup></Signup></Route>
            <Route path='/login' exact><Login></Login></Route>
            <Route path='/profile' exact><Profile></Profile></Route>
            <Route path='/create' exact><CreatePost/></Route>
            <Route path='/profile/:userid' exact><UserProfile></UserProfile></Route>
            <Route path='/myfollowingpost' exact><SubscribedPosts/></Route>
            <Route path="/changename"><ChangeUsername /> </Route>
           <Route path="/changepassword"><NewPassword /> </Route>
          
        </Switch>
    )
}

function App() {
const [state,dispatch]=useReducer(reducer,initialState)    
    return (
         <UserContext.Provider value={{state,dispatch}}>
        <div>
        <BrowserRouter>
        <NavBar/>
            <Routing></Routing>
        </BrowserRouter>
        
            
        </div>
        </UserContext.Provider>
    )
}

export default App
