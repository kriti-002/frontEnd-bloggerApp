import Axios from 'axios';
import React, { useEffect, useContext} from 'react'
import { NavLink, useParams, Routes, Route } from 'react-router-dom'
import Page from './Page'
import StateContext from '../StateContext';
import ProfilePosts from './ProfilePosts';
import { useImmer } from 'use-immer';
import ProfileFollowers from './ProfileFollowers';
import ProfileFollowing from './ProfileFollowing';
import NotFound from './NotFound';

const Profile = () => {
    const {username}= useParams();
    const appState= useContext(StateContext);
    const [state, setState] = useImmer({
      profileData: {
        profileUsername: "...",
        profileAvatar: "https://gravatar.com/avatar/placeholder?s=128",
        isFollowing: false,
        counts: {postCount:"", followerCount: "", followingCount: ""}

    }, 
    followActionLoading: false,
    startFollowingRequestCount: 0,
    stopFollowingRequestCount: 0
    })
    
    
    useEffect(()=>{
      const ourRequest= Axios.CancelToken.source()
        async function fetchData(){
            try{
                const resp= await Axios.post(`/profile/${username}`, {token: appState.user.token}, {cancelToken: ourRequest.token})
                //if(resp.data== false) return (<><NotFound /></>)
                setState(draft => {
                  draft.profileData= resp.data
                });
            }catch(err){
                console.log(err);
            }
        }
        fetchData()
        return ()=>{ourRequest.cancel()}
    }, [username]);
  
    useEffect(()=>{
      if(state.startFollowingRequestCount){
        setState(draft =>{
          draft.followActionLoading=true
        })
        const ourRequest= Axios.CancelToken.source()
        async function fetchData(){
            try{
                const resp= await Axios.post(`/addFollow/${state.profileData.profileUsername}`, {token: appState.user.token}, {cancelToken: ourRequest.token})
                setState(draft => {
                  draft.profileData.isFollowing=true
                  draft.profileData.counts.followerCount++
                  draft.followActionLoading=false
                });
            }catch(err){
                console.log(err);
            }
        }
        fetchData()
        return ()=>{ourRequest.cancel()}
      }
    }, [state.startFollowingRequestCount]);
    
  function startFollowing(){
    setState(draft => {
      draft.startFollowingRequestCount++
    })
  }

  useEffect(()=>{
    if(state.stopFollowingRequestCount){
      setState(draft =>{
        draft.followActionLoading=true
      })
      const ourRequest= Axios.CancelToken.source()
      async function fetchData(){
          try{
              const resp= await Axios.post(`/removeFollow/${state.profileData.profileUsername}`, {token: appState.user.token}, {cancelToken: ourRequest.token})
              setState(draft => {
                draft.profileData.isFollowing= false
                draft.profileData.counts.followerCount--
                draft.followActionLoading=false
              });
          }catch(err){
              console.log(err);
          }
      }
      fetchData()
      return ()=>{ourRequest.cancel()}
    }
  }, [state.stopFollowingRequestCount]);


  function stopFollowing(){
    setState(draft=> {
      draft.stopFollowingRequestCount++
    })
  }

  return (
    <Page title="Profile">
      <h2>
      <img className="avatar-small" src={state.profileData.profileAvatar} /> {state.profileData.profileUsername}
        {appState.loggedIn && !state.profileData.isFollowing && appState.user.username != state.profileData.profileUsername && state.profileData.profileUsername != "..." && (
          <button onClick={startFollowing} disabled={state.followActionLoading} className="btn btn-primary btn-sm ml-2">
            Follow <i className="fas fa-user-plus"></i>
          </button>
        )}
        {appState.loggedIn && state.profileData.isFollowing && appState.user.username != state.profileData.profileUsername && state.profileData.profileUsername != "..." && (
          <button onClick={stopFollowing} disabled={state.followActionLoading} className="btn btn-danger btn-sm ml-2">
          Unfollow <i className="fas fa-user-times"></i>
          </button>
        )}
      </h2>

      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        <NavLink to="" end className="nav-item nav-link">
          Posts: {state.profileData.counts.postCount}
        </NavLink>
        <NavLink to="followers" className="nav-item nav-link">
          Followers: {state.profileData.counts.followerCount}
        </NavLink>
        <NavLink to="following" className="nav-item nav-link">
          Following: {state.profileData.counts.followingCount}
        </NavLink>
      </div>

      <Routes>
        <Route path='' element={<ProfilePosts />} />
        <Route path='followers' element={<ProfileFollowers />} />
        <Route path='following' element={<ProfileFollowing />} />
      </Routes>

    </Page>
  )
}

export default Profile