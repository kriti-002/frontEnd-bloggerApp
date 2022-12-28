import Axios from 'axios';
import React, {useEffect, useState, useContext} from 'react'
import DispatchContext from '../DispatchContext';


const HeaderLoggedOut = () => {
    const appDispatch= useContext(DispatchContext);
    const [username, setUsername]= useState();
    const [password, setPassword]= useState();
    async function handleSubmit(e){
        e.preventDefault();
        try{
            const response= await Axios.post("/login", {username, password});
            if(response.data){
                //console.log(response.data);

                /*
                localStorage.setItem("complexappToken", response.data.token);
                localStorage.setItem("complexappUsername", response.data.username);
                localStorage.setItem("complexappAvatar", response.data.avatar);
                */
                appDispatch({type: "login", data: response.data});
                appDispatch({type: "flashMessage", value : "Successfully Logged In!!"})
            }else{
                console.log("Incorrect Username/Password");
                appDispatch({type: "flashMessage", value : "Incorrect Username/Password"})
            }
        }catch(e){
            console.log("Uh-oh");
        }
    }
    return (
    <div>
        <form onSubmit={handleSubmit} className="mb-0 pt-2 pt-md-0">
          <div className="row align-items-center">
            <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
              <input onChange={e=> setUsername(e.target.value)} name="username" className="form-control form-control-sm input-dark" type="text" placeholder="Username" autoComplete="off" />
            </div>
            <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
              <input name="password" onChange={e=> setPassword(e.target.value)} className="form-control form-control-sm input-dark" type="password" placeholder="Password" />
            </div>
            <div className="col-md-auto">
              <button className="btn btn-success btn-sm">Sign In</button>
            </div>
          </div>
        </form>
    </div>
  )
}

export default HeaderLoggedOut