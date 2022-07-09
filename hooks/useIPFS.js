import { create } from 'ipfs-http-client';
import React from 'react'

function useIPFS() {
    let ipfs;
    try {
        ipfs = create({
            url: "https://ipfs.infura.io:5001/api/v0",

        });
    } catch (error) {
        console.error("IPFS error ", error);
        ipfs = undefined;
    }

    const uploadFile = async (file) => {
        const result = await ipfs.add(file);
        return {
            cid: result.cid,
            path: result.path
        }
    }
    return {
        ipfs,
        uploadFile
    }
}

export default useIPFS