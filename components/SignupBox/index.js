import React, { useState } from 'react'

function SignupBox({signupUser}) {
    const [username, setUsername] = useState("");
    const [profile_pic, setProfile_pic] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault()
        signupUser(username, profile_pic)
    }
    return (
        <div className='signup-container'>
            <form className='signup-box' onSubmit={e=>handleSubmit(e)}>
                <div className='title'>Let&apos;s get Started</div>
                <div className='sub-title'>Set your profile.</div>
                <input
                    type="text"
                    value={username}
                    onChange={e=>setUsername(e.target.value)}
                    placeholder="Your username"
                    required
                />
                <input
                    type="text"
                    value={profile_pic}
                    onChange={e=>setProfile_pic(e.target.value)}
                    placeholder="Profile image link"
                    required
                />
                <button className='signup-btn' type='submit'>Let Me In!</button>
            </form>
        </div>
    )
}

export default SignupBox