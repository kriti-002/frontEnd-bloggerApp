import Axios from 'axios'
import React, { useState, useEffect, useContext } from 'react'
import { Link, useParams } from 'react-router-dom'
import StateContext from '../StateContext'
import LoadingDotsIcon from './LoadingDotsIcon'

const ProfileFollowing = () => {
    const {username}= useParams()
    const appState= useContext(StateContext)
    const [isLoading, setIsLoading]= useState(1)
    const [posts, setPosts]= useState([]);

    useEffect(() => {
      const ourRequest= Axios.CancelToken.source()
      async function fetchPosts(){
        try{
            const resp= await Axios.get(`/profile/${username}/following`, {cancelToken: ourRequest.token})
            setPosts(resp.data)
            setIsLoading(0)
            //console.log(resp.data)
        }catch(err){
            console.log(err);
        }
      }
      fetchPosts()
      return ()=>{
        //cancel axios request
        ourRequest.cancel()
      }
    }, [username])
    
    if(isLoading) return <LoadingDotsIcon />
  return (
        <div className="list-group">
        {posts.map((follower, index)=>{
            return(
            <Link key={index} to={`/profile/${follower.username}`} className="list-group-item list-group-item-action">
            <img className="avatar-tiny" src={follower.avatar} /> {follower.username}
          </Link>
            )
        }, )}
        
      </div>
  )
}

export default ProfileFollowing