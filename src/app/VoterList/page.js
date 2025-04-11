"use client"
import React, {useState, useEffect, useContext} from 'react'
import { VoterCard } from '@/components/VoterCard/VoterCard'
import { VotingContext } from '@/context/Voter'

export default function voterList() {
    const {getAllVoterData, voterArray} = useContext(VotingContext);
    useEffect(() => {
        getAllVoterData();
    }, [])
    return (
        <div className='h-[100vh] w-[85%] mx-auto my-4 sm:w-[70%]'>
            <VoterCard voterArray={voterArray}/>
        </div>
    )
}
