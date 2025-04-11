"use client"
import React, { useState, useContext } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AiFillLock, AiFillUnlock } from 'react-icons/ai'

import { VotingContext } from '@/context/Voter'

export const NavBar = () => {
    const { currentAccount, connectWallet, error } = useContext(VotingContext)
    const [openNav, setOpenNav] = useState(false);
    const openNavigation = () => {
        if (!openNav) {
            setOpenNav(true)
        }
        else {
            setOpenNav(false)
        }
    }
    return (
        <div className='w-full bg-[#231e39] shadow-[0_4px_6px_rgba(0,0,0,0.35)] text-[#6596c4] flex items-center justify-between mb-[2rem]'>
            {error === "" ? ("") : (
                <div>
                    <div className='top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 absolute bg-[#006aff] px-[5rem] py-[3rem] rounded-lg '>
                        <p>{error}</p>
                    </div>
                </div>
            )}
            <div className='w-[80%] mx-auto flex items-center justify-between text-white'>
                <div className=''>
                    <Link href="/">
                        <Image src={"/logo.png"} alt='logo' width={50} height={50} />
                    </Link>
                </div>

                <div className='flex bg-[#006aff] p-2 rounded-lg cursor-pointer shadow-[0_4px_6px_rgba(0,0,0,0.35)]'>
                    {
                        currentAccount ? (
                            <div >
                                <div className='flex items-center justify-between'>
                                    <button className='bg-transparent border-none text-white font-[600] cursor-pointer' onClick={() => openNavigation()}>
                                        {currentAccount.slice(0, 10)}...
                                    </button>
                                    {currentAccount ? (<span className='ml-2'>{open ? (
                                        <AiFillUnlock onClick={() => openNavigation()} />
                                    ) : (
                                        <AiFillLock onClick={() => openNavigation()} />
                                    )}</span>
                                    ) : ("")}
                                </div>

                                {openNav && (
                                    <div className='absolute bg-[#006aff] p-2 rounded-lg right-[8rem] top-[4rem] z-1111111 shadow-[0_4px_6px_rgba(0,0,0,0.35)]'>
                                        <p>
                                            <Link href="/">Home</Link>
                                        </p>
                                        <p>
                                            <Link href="/CandidateRegistration">Candidate Registration</Link>
                                        </p>
                                        <p>
                                            <Link href="/AllowedVoter">Voter Registration</Link>
                                        </p>
                                        <p>
                                            <Link href="/VoterList">Voter List</Link>
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button onClick={()=>connectWallet()}>Connect Wallet</button>
                        )
                    }
                </div>
            </div>
        </div>
    )
}
