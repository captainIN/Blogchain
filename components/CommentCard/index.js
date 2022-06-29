import React, { useEffect, useState } from 'react'

function CommentCard({ data, getUserInfo }) {
  const {
    author,
    content,
    index,
    username,
    createdAt
  } = data;
  const [userData, setUserData] = useState(null)
  useEffect(() => {
    async function getUser() {
      let data = await getUserInfo(author);
      setUserData(data)
    }
    getUser()
  }, [])

  return (
    <div className='comment-card'>
      <div className='user-section'>
        <div className='author'>
        {userData && <img src={userData.profileImage} alt={username} />}
          <div className='user'>{username}</div>
          <div className='date-time'>
          {new Date(createdAt.toString() * 1000).toLocaleDateString()} {new Date(createdAt.toString() * 1000).toLocaleTimeString()}
          </div>
        </div>
      </div>
      <div className='comment-content'>{content}</div>
      
      
    </div>
  )
}

export default CommentCard