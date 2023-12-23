import React from 'react'
import {Link} from 'react-router-dom'

export const About = () => {
  return (
    <div>
      <h1>Home</h1>
      <Link to="/test/1" component={Link}>
        <button>Go to Target Component</button>
      </Link>
    </div>
  )
}
