import React, { useState, useEffect, useContext } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import Axios from 'axios';
import Page from './Page'
import LoadingDotsIcon from './LoadingDotsIcon';
import ReactMarkdown  from 'react-markdown';
import { Tooltip as ReactTooltip } from 'react-tooltip'
import NotFound from './NotFound';
import StateContext from '../StateContext'
import DispatchContext from '../DispatchContext'

const ViewSinglePost = () => {
  const appState= useContext(StateContext)
  const appDispatch= useContext(DispatchContext)
  const {id}= useParams()
  const navigate= useNavigate()
  const [isLoading, setIsLoading]= useState(1);
  const [posts, setPosts]= useState([]);

    useEffect(() => {
      const ourRequest= Axios.CancelToken.source()
      async function fetchPost(){
        try{
            const resp= await Axios.get(`/post/${id}`, {cancelToken: ourRequest.token})
            setPosts(resp.data)
            setIsLoading(0)
            //console.log(resp.data)
        }catch(err){
            console.log(err);
        }
      }
      fetchPost()
      return ()=> {ourRequest.cancel()}
    }, [id])
  
  if(!isLoading && !posts) return <NotFound />  
  if(isLoading) return <Page title="...."><LoadingDotsIcon/></Page>
  const date= new Date(posts.createdDate)
  const dateFormatted= `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
  
  function isOwner(){
    if(appState.loggedIn) return appState.user.username == posts.author.username
    return 0
  }

  async function deleteHandler(){
    const areYouSure = window.confirm("Do you really want to delete this post?")
    if(areYouSure){
      try{
        const resp= await Axios.delete(`/post/${id}`, {data: {token: appState.user.token}})
        if(resp.data== "Success"){
          //disp flash message
          appDispatch({type: "flashMessage", value: "Deleted Successfully!!"})
          //redirect to current user profile
          navigate(`/profile/${appState.user.username}`)
        }

      }catch(e){
        console.log(e)
      }
    }
  }

  return (
    <Page title={posts.title}>
    <div className="d-flex justify-content-between">
        <h2>{posts.title}</h2>
        {isOwner() && <span className="pt-2">
          <Link to={`/post/${posts._id}/edit`} data-tip="Edit" data-for="edit" className="text-primary mr-2" title="Edit"><i className="fas fa-edit"></i></Link>
          <ReactTooltip anchorid='edit' className='custom-tooltip'/>
          <Link className="delete-post-button text-danger" title="Delete" onClick={deleteHandler}><i className="fas fa-trash"></i></Link>
        </span>}
        
      </div>

      <p className="text-muted small mb-4">
        <Link to={`/profile/${posts.author.username}`}>
          <img className="avatar-tiny" src={posts.author.avatar} />
        </Link>
        Posted by <Link to={`/profile/${posts.author.username}`}>{posts.author.username}</Link> on {dateFormatted}
      </p>

      <div className="body-content">
        <ReactMarkdown children={posts.body} allowedElements={["p", "br", "strong", "em", "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li"]} />
      </div>
    </Page>
  )
}

export default ViewSinglePost