import React, { useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import DispatchContext from "../DispatchContext"
import StateContext from "../StateContext"
//import { Tooltip as ReactTooltip } from "react-tooltip"

function HeaderLoggedIn(props) {
  const appDispatch = useContext(DispatchContext)
  const appState = useContext(StateContext)

  function handleLogout() {
    appDispatch({ type: "logout" })
    appDispatch({type: "flashMessage", value: "You have successfully logged out!"})
  }

  function handleSearchIcon(e) {
    e.preventDefault()
    appDispatch({ type: "openSearch" })
  }

  return (
    <div className="flex-row my-3 my-md-0">
      <a title='Search' onClick={handleSearchIcon} href="#" className="text-white mr-2 header-search-icon">
        <i className="fas fa-search"></i>
      </a>
      
      <span onClick={()=> appDispatch({type: "toggleChat"})} title="Chat" className={"mr-2 header-chat-icon " + (appState.unreadChatCount ? "text-danger" : "text-white") }>
        <i className="fas fa-comment"></i>
        {appState.unreadChatCount ? <span className="chat-count-badge text-white">{appState.unreadChatCount < 10  ? appState.unreadChatCount : "9+"}</span> : ""}
      </span>
      
      <Link title='My Profile' to={`/profile/${appState.user.username}`} className="mr-1">
        <img className="small-header-avatar" src={appState.user.avatar} />
      </Link>
      
      <Link className="btn btn-sm btn-success mr-1" to="/create-post">
        Create Post
      </Link>{" "}
      <button onClick={handleLogout} className="btn btn-sm btn-secondary">
        Sign Out
      </button>
    </div>
  )
}

export default HeaderLoggedIn