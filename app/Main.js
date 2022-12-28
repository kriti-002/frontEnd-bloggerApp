import React, { useState, useReducer, useEffect, Suspense } from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useImmerReducer } from "use-immer"
import { CSSTransition } from "react-transition-group" 
import Axios from "axios"
Axios.defaults.baseURL = process.env.BACKENDURL || "https://myfirstbackend.onrender.com"

import StateContext from "./StateContext"
import DispatchContext from "./DispatchContext"

// My Components
import Header from "./components/Header"
import HomeGuest from "./components/HomeGuest"
import Home from "./components/Home"
import Footer from "./components/Footer"
import About from "./components/About"
import Terms from "./components/Terms"
const CreatePost= React.lazy(()=> import('./components/CreatePost'))
const ViewSinglePost= React.lazy(()=> import('./components/ViewSinglePost'))
//import ViewSinglePost from "./components/ViewSinglePost"
import FlashMessages from "./components/FlashMessages"
import Profile from "./components/Profile"
import EditPost from "./components/EditPost"
import NotFound from "./components/NotFound"
const Search= React.lazy(()=> import('./components/Search'))
const Chat= React.lazy(()=> import('./components/Chat'))
//import Search from "./components/Search"
//import Chat from "./components/Chat"
import LoadingDotsIcon from "./components/LoadingDotsIcon"

function Main() {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("complexappToken")),
    flashMessages: [],
    user: {
      token: localStorage.getItem("complexappToken"),
      username: localStorage.getItem("complexappUsername"),
      avatar: localStorage.getItem("complexappAvatar")
    }, 
    isSearchOpen: false,
    isChatOpen: false,
    unreadChatCount : 0
  }

  function ourReducer(draft, action) {
    switch (action.type) {
      case "login":
        draft.loggedIn= true;
        draft.user= action.data;
        //return { loggedIn: 1, flashMessages: state.flashMessages }
        break
      case "logout":
        draft.loggedIn=false;
        //return { loggedIn: 0, flashMessages: state.flashMessages }
        break
      case "flashMessage":
       draft.flashMessages.push(action.value);
       //return { loggedIn: state.loggedIn, flashMessages: state.flashMessages.concat(action.value) }
       break
      case "openSearch":
        draft.isSearchOpen= true;
        break
      case "closeSearch":
        draft.isSearchOpen= false;
        break
      case "toggleChat":
        draft.isChatOpen= !draft.isChatOpen
        break
      case "closeChat":
        draft.isChatOpen =false
        break
      case "incrementUnreadChatCount":
        draft.unreadChatCount++
        break
      case "clearUnreadChatCount":
        draft.unreadChatCount=0
        break
      default: 
        break
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState)
  useEffect(()=>{
    if(state.loggedIn){
      localStorage.setItem("complexappToken", state.user.token);
      localStorage.setItem("complexappUsername", state.user.username);
      localStorage.setItem("complexappAvatar", state.user.avatar);
    }else{
      localStorage.removeItem("complexappToken", state.user.token);
      localStorage.removeItem("complexappUsername", state.user.username);
      localStorage.removeItem("complexappAvatar", state.user.avatar);
    }
  }, [state.loggedIn]);

  //check if token is expired or not on first render
  useEffect(() => {
    if (state.loggedIn) {
      const ourRequest = Axios.CancelToken.source()
      async function fetchResults() {
        try {
          const response = await Axios.post("/checkToken", { token : state.user.token }, { cancelToken: ourRequest.token })
          if(!response.data){
            dispatch({type: "logout"})
            dispatch({type: "flashMessage", value: "Your session has been expired. Login again!"})
          }
        } catch (e) {
          console.log(e)
        }
      }
      fetchResults()
      return () => ourRequest.cancel()
    }
  }, [])
  

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <FlashMessages messages={state.flashMessages} />
          <Header />
          <Suspense fallback={<LoadingDotsIcon />}>
            <Routes>
              <Route path="/" element={state.loggedIn ? <Home /> : <HomeGuest />} />
              <Route path="/post/:id" element={<ViewSinglePost />} />
              <Route path="/post/:id/edit" element={<EditPost />} />
              <Route path="/create-post" element={<CreatePost />} />
              <Route path="/about-us" element={<About />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/profile/:username/*" element={<Profile/>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          
          <CSSTransition timeout={330} in={state.isSearchOpen} classNames="search-overlay" unmountOnExit>
            <div className="search-overlay">
              <Suspense fallback="">
                <Search />
              </Suspense>
            </div>
          </CSSTransition>
          <Suspense fallback="">
            {state.loggedIn && <Chat />}
          </Suspense>
          <Footer />
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}

const root = ReactDOM.createRoot(document.querySelector("#app"))
root.render(<Main />)

if (module.hot) {
  module.hot.accept()
}