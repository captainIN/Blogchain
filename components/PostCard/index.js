import { Box, Button, Modal } from '@mui/material';
import React, { useEffect, useState } from 'react'
import CommentCard from '../CommentCard';
import DeleteDialog from '../DeleteDialog';


function PostCard({ data, createComment, getAllComments, getUserInfo, deletePost, walletAddress }) {
    let {
        author,
        commentCount,
        content,
        username,
        index,
        createdAt
    } = data.account;

    const [commentText, setCommentText] = useState("")

    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [showCommentPopup, setShowCommentPopup] = useState(false);
    const [allComments, setAllComments] = useState([]);

    useEffect(() => {
        if (showCommentPopup) {
            collectComments();
        }
    }, [showCommentPopup])
    const collectComments = async (offset = 0) => {
        let comments = await getAllComments(
            index,
            parseInt(commentCount.toString()) + offset
        );

        setAllComments(comments)
    }
    const handleSubmit = async (e) => {
        e.preventDefault();

        await createComment(index, commentText);
        setCommentText("")
        collectComments(1);
    }
    const isOwnerOfPost = author.toString() === walletAddress;
    return (
        <div className='post-card'>
            <div className='absolute-date-time'>{new Date(createdAt.toString() * 1000).toLocaleDateString()} {new Date(createdAt.toString() * 1000).toLocaleTimeString()}</div>
            <div className='content'>{content}</div>
            <div className='bottom'>
                <div className='user'>{username}</div>

                <div className='comment-btn' onClick={() => setShowCommentPopup(true)}>
                    <img src="https://www.pngitem.com/pimgs/m/21-212930_transparent-square-speech-bubble-png-transparent-instagram-comment.png" alt="comment-icon" />
                    <div className='count'>{commentCount.toString()}</div>
                </div>
            </div>
            {isOwnerOfPost && <div className='delete-button' onClick={() => setShowDeletePopup(true)}>
                <img src="/delete.png" alt="delete" />

            </div>}

            <Modal
                open={showCommentPopup}
                onClose={() => { setShowCommentPopup(false) }}
                aria-labelledby="parent-modal-form-create-comment"
                aria-describedby="parent-modal-form-create-comment-desc"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    borderRadius: 1,
                    p: 3,
                }}>
                    <form onSubmit={e => handleSubmit(e)} className="comment-form">
                        <textarea
                            className='comment-input'
                            value={commentText}
                            onChange={e => setCommentText(e.target.value)}
                            placeholder="Send your opinion!"
                            required
                        ></textarea>

                        <Button className='comment-submit-btn' variant="outlined" type='submit'>Send</Button>
                    </form>
                    <div className='comment-container'>
                        {allComments.slice().reverse().map(item => {
                            return <CommentCard
                                key={item.index.toString()}
                                data={item}
                                getUserInfo={getUserInfo}
                            />
                        })}
                    </div>
                </Box>
            </Modal>
            <DeleteDialog
                open={showDeletePopup}
                handleClose={() => setShowDeletePopup(false)}
                handleProceed={()=>{
                    deletePost();
                    setShowDeletePopup(false);
                }}
            />
        </div>
    )
}

export default PostCard