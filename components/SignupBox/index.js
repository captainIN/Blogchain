import React, { useState } from 'react'
import useImageCompress from '../../hooks/useImageCompress';
import useIPFS from '../../hooks/useIPFS';

function SignupBox({ signupUser }) {
    const [username, setUsername] = useState("");
    const [profile_pic, setProfile_pic] = useState(null);
    const { ipfs, uploadFile } = useIPFS();
    const { compress } = useImageCompress()

    const handleSubmit = async (e) => {
        e.preventDefault()
        if(!profile_pic) { return; }
        
        let ipfs_result = await uploadFile(profile_pic);
        console.log("file upload results =>",ipfs_result);
        signupUser(username, "https://ipfs.infura.io/ipfs/"+ipfs_result.path);
    }

    const processImage = async (image) => {
        let compressed_image = await compress(image);
        console.log({compressed_image})
        setProfile_pic(compressed_image)
    }
    return (
        <div className='signup-container'>
            <form className='signup-box' onSubmit={e => handleSubmit(e)}>
                <div className='title'>Let&apos;s get Started</div>
                <div className='sub-title'>Set your profile.</div>
                {profile_pic && <img className='signup-user-profile-pic' src={URL.createObjectURL(profile_pic)} alt="user profile"/>}
                <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="Your username"
                    required
                />
                {ipfs ? (
                    <input
                        type="file"
                        onChange={e => processImage(e.target.files[0])}
                        placeholder="Profile image link"
                        required
                    />
                ) : <div>No Image uploader! Facing problems with IPFS.</div>}
                <button className='signup-btn' type='submit'>Let Me In!</button>
            </form>
        </div>
    )
}

export default SignupBox