import React from 'react'
import { Link } from 'react-router-dom'
import Page from './Page'

const NotFound = () => {
  return (
    <Page title="Post Not Found">
    <div className='text-center'>
        <h2>Page can't be found.</h2>
        <Link to="/">You can always visit the homepage to get a fresh start!</Link>
    </div>
    </Page>
  )
}

export default NotFound