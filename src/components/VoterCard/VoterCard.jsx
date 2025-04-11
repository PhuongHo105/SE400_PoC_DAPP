import React from 'react'
import Image from 'next/image'


export const VoterCard = ({ voterArray }) => {
    return (
        <div className='w-full grid grid-cols-1 sm:grid-cols-3 gap-[2rem]'>
            {voterArray.map((el, i) => (
                <div key={i+1} className='bg-[#231e39] p-[2rem] rounded-lg shadow-[0_4px_6px_rgba(0,0,0,0.35)] text-[#6596c4] leading-relaxed text-center flex flex-col justify-center items-center'>
                    <div>
                        <Image src={el[2]} alt="voter" width={200} height={200} className='w-full' />
                    </div>

                    <div className='p-2'>
                        <h2>{el[1]} #{Number(el[0])}</h2>
                        <p>Address: {el[3].slice(0,30)}...</p>
                        <p>Details:</p>
                        {console.log(el[5])}
                        <p className='bg-[#006aff] p-2 rounded-lg text-white font-[700]'> 
                            {el[5]===true? "Already Voted": "Not Voted Yet"}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    )
}
