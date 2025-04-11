import React from 'react'
import Image from 'next/image'


export const Card = ({candidateArray, giveVote, hasVoted}) => {
    console.log(candidateArray);
    return (
        <div className='w-full grid grid-cols-1 sm:grid-cols-3 gap-[2rem]'>
            {candidateArray.map((el, i) => (
                <div key={i + 1} className='bg-[#231e39] p-[2rem] rounded-lg shadow-[0_4px_6px_rgba(0,0,0,0.35)] text-[#6596c4] leading-relaxed text-center flex flex-col justify-center items-center'>
                    <div>
                        <Image src={el[3]} alt='profile' width={200} height={200} className='w-full'/>
                    </div>

                    <div className='p-2'>
                        <h2 className='font-bold text-2xl'>{el[1]} #{Number(el[2])}</h2>
                        <p>{el[0]}</p>
                        <p>Address: {el[6].slice(0, 30)}...</p>
                    </div>
                    {console.log(el)}
                    <div className=''>
                        <p className='w-full px-13 mb-2 py-1 rounded-sm bg-[#006aff] text-white'>Total Vote</p>
                        <p className='font-bold text-3xl text-[#006aff]'>{Number(el[4])}</p>
                    </div>

                    <div className='mb-2 p-2'>
                        <button className='bg-[#006aff] border-none text-[#fff] px-5 py-2 font-medium cursor-pointer rounded-lg shadow-[0_4px_6px_rgba(0,0,0,0.35)]'
                        disabled = {hasVoted}
                        onClick={() => {
                            console.log(el);
                            giveVote({id:Number(el[2]), address: el[6]})
                        }}>
                            {hasVoted ? "You Have Already Voted" : "Give Vote"}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}
