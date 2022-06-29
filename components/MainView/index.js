import { useWallet } from '@solana/wallet-adapter-react'
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js'
import * as anchor from '@project-serum/anchor'
import idl from '../../idl.json';
import React, { useEffect, useState } from 'react'
import { utf8 } from '@project-serum/anchor/dist/cjs/utils/bytes';
import { Provider } from '@project-serum/anchor';
import PostCard from '../PostCard';
import SignupBox from '../SignupBox';
import UserProfile from '../UserProfile';
import { Button, Modal, TextareaAutosize } from '@mui/material';
import { Box } from '@mui/material';
import next from 'next';
const opts = {
    preflightCommitment: "processed"
}

// Get our program's id from the IDL file.
const programID = new PublicKey(idl.metadata.address);

// Set our network to devnet.
const network = clusterApiUrl('devnet');

function MainView() {
    const wallet = useWallet()
    const walletAddress = wallet.publicKey.toString();

    const [content, setContent] = useState("")
    const [all_posts, set_all_posts] = useState([])

    const [hasAccount, setHasAccount] = useState(null)
    const [userData, setUserData] = useState(null)

    const [showCreateForm, setShowCreateForm] = useState(false)


    useEffect(() => {
        checkAccount();
        if (hasAccount) {
            getAllPost()
        }

    }, [hasAccount])
    const checkAccount = async () => {
        let [user_pda] = await anchor.web3.PublicKey.findProgramAddress(
            [utf8.encode("user"), wallet.publicKey.toBuffer()],
            program.programId
        )
        try {
            let user_data = await program.account.userState.fetch(user_pda);
            console.log(user_data)
            setUserData(user_data)
            setHasAccount(true)
        } catch {
            console.log("New user found!")
            setHasAccount(false);
        }
    }
    const signupUser = async (username, profile_image) => {
        let [user_pda] = await anchor.web3.PublicKey.findProgramAddress(
            [utf8.encode("user"), wallet.publicKey.toBuffer()],
            program.programId
        )
        let tx = await program.rpc.createUser(username, profile_image, {
            accounts: {
                userState: user_pda,
                authority: wallet.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId,
                clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
            }
        });

        console.log("create user tx=", tx)
        checkAccount();
    }
    const getProvider = () => {
        const connection = new Connection(network, opts.preflightCommitment);
        const provider = new Provider(
            connection, wallet, opts.preflightCommitment,
        );
        return provider;
    }
    const provider = getProvider();
    const program = new anchor.Program(
        idl,
        programID,
        provider
    )
    const createPost = async (nextFunc) => {
        let [state_pda] = await anchor.web3.PublicKey.findProgramAddress(
            [utf8.encode("state")],
            program.programId
        )
        console.log({ state_pda })

        try {
            const stateInfo = await program.account.accountState.fetch(state_pda);
        } catch {
            // if the state is not fetched
            let state_tx = await program.rpc.initializeAccount({
                accounts: {
                    accountState: state_pda,
                    authority: wallet.publicKey,
                    systemProgram: anchor.web3.SystemProgram.programId
                }
            })
            console.log({ state_tx })
        }

        const stateInfo = await program.account.accountState.fetch(state_pda);
        console.log({ stateInfo })

        let [user_pda] = await anchor.web3.PublicKey.findProgramAddress(
            [utf8.encode("user"), wallet.publicKey.toBuffer()],
            program.programId
        )

        let [post_pda] = await anchor.web3.PublicKey.findProgramAddress(
            [utf8.encode('post'), stateInfo.postsCount.toArrayLike(Buffer, 'be', 8)],
            program.programId
        );
        console.log({ stateInfo })

        let tx = await program.rpc.createPost(content, {
            accounts: {
                accountState: state_pda,
                userState: user_pda,
                post: post_pda,
                authority: wallet.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId,
                clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
            }
        })

        console.log("transaction of createPost =", tx)
        nextFunc()
        getAllPost()
    }
    const createComment = async (post_index, content) => {
        let [user_pda] = await anchor.web3.PublicKey.findProgramAddress(
            [utf8.encode("user"), wallet.publicKey.toBuffer()],
            program.programId
        )

        let [post_pda] = await anchor.web3.PublicKey.findProgramAddress(
            [utf8.encode("post"), new anchor.BN(post_index).toArrayLike(Buffer, 'be', 8)],
            program.programId
        )
        let post_info = await program.account.post.fetch(post_pda);

        let [comment_pda] = await anchor.web3.PublicKey.findProgramAddress(
            [
                utf8.encode("comment"),
                new anchor.BN(post_info.index).toArrayLike(Buffer, 'be', 8),
                new anchor.BN(post_info.commentCount).toArrayLike(Buffer, 'be', 8),
            ],
            program.programId
        )
        let tx = await program.rpc.createComment(content, {
            accounts: {
                post: post_pda,
                userState: user_pda,
                comment: comment_pda,
                authority: wallet.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId,
                clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
            }
        })
        console.log("transaction of createComment =", tx)
    }
    const getAllPost = async () => {
        const all_posts = await program.account.post.all();
        console.log({ all_posts })
        set_all_posts(all_posts)
    }
    const getAllComments = async (post_index, comment_count) => {
        let all_comment_pda = [];
        for (let i = 0; i < comment_count; i++) {
            let [comment_pda] = await anchor.web3.PublicKey.findProgramAddress(
                [
                    utf8.encode("comment"),
                    new anchor.BN(post_index).toArrayLike(Buffer, 'be', 8),
                    new anchor.BN(i).toArrayLike(Buffer, 'be', 8),
                ],
                program.programId
            )
            all_comment_pda.push(comment_pda);
        }
        const all_comments = await program.account.comment.fetchMultiple(all_comment_pda);
        console.log({ all_comments });
        return all_comments;
    }
    const getUserInfo = async (user_public_key) => {
        let [user_pda] = await anchor.web3.PublicKey.findProgramAddress(
            [utf8.encode("user"), user_public_key.toBuffer()],
            program.programId
        )
        let user_data = await program.account.userState.fetch(user_pda);
        return user_data
    }
    const deletePost = async (post_index) => {
        let [post_pda] = await anchor.web3.PublicKey.findProgramAddress(
            [utf8.encode("post"), new anchor.BN(post_index).toArrayLike(Buffer, 'be', 8)],
            program.programId
        )
        let tx = await program.rpc.deletePost({
            accounts: {
                post: post_pda,
                author: wallet.publicKey
            }
        })

        console.log("deleted post tx=",tx)
    }
    return (
        <>
            {hasAccount === null && <div>Validating User!</div>}
            {hasAccount === false ?

                <SignupBox signupUser={signupUser} />
                :
                hasAccount !== null && <>
                    <div className='head-banner'>
                        <div className='logo'>Blogchain</div>
                        <UserProfile
                            username={userData.username}
                            user_profile_image={userData.profileImage}
                        />
                    </div>
                    <div className='data-container'>

                        <div className='posts-list-header'>
                            <h1>All Posts</h1>
                            <Button variant="contained" onClick={() => setShowCreateForm(true)}>Create Post</Button>
                        </div>

                        <div className='post-grid'>
                            {all_posts.map(item => {
                                return <PostCard
                                    data={item}
                                    key={Number(item.account.index.toString())}
                                    createComment={createComment}
                                    getAllComments={getAllComments}
                                    getUserInfo={getUserInfo}
                                    deletePost={deletePost}
                                    walletAddress={walletAddress}
                                />
                            })}
                        </div>
                        <Modal
                            open={showCreateForm}
                            onClose={() => { setShowCreateForm(false) }}
                            aria-labelledby="parent-modal-form-create-post"
                            aria-describedby="parent-modal-form-create-post-desc"
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
                                <form onSubmit={e => {
                                    e.preventDefault();
                                    createPost(()=>{
                                        setContent("")
                                        setShowCreateForm(false);
                                    });
                                }}>
                                    <div className='create-post-form-heading'>Create your post</div>
                                    <TextareaAutosize
                                        minRows={8}
                                        className="text-area"
                                        value={content}
                                        onChange={e => setContent(e.target.value)}
                                        placeholder="Your content goes here"
                                    />
                                    <button className='post-submit-btn' type='submit'>Post</button>
                                </form>
                            </Box>
                        </Modal>
                    </div>
                </>
            }

        </>
    )
}

export default MainView