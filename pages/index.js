
import { useWallet } from '@solana/wallet-adapter-react';
import Head from 'next/head'
import Image from 'next/image'
import LoginBox from '../components/LoginBox';
import MainView from '../components/MainView';
// import { useWallet } from '@solana/wallet-adapter-react';

export default function Home() {
  
  const { connected } = useWallet()
  let viewToDisplay = connected ? <MainView /> : <LoginBox />;

  return (
    <>
      <Head>
        <title>Blogchain</title>
        
      </Head>
      {viewToDisplay}
    </>
  )
}
