import React from 'react'

function UserProfile({
    username,
    user_profile_image
}) {
  return (
    <div className='user-profile'>
        <img src={user_profile_image} alt={username}/>
        <div className='name'>Welcome, {username}</div>
    </div>
  )
}

export default UserProfile