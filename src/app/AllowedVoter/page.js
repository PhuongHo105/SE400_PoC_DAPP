"use client";
import React, { useState, useEffect, useCallback, useContext } from 'react'
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';

import { VotingContext } from '@/context/Voter';
import { Button } from '@/components/Button/Button';
import { Input } from '@/components/Input/Input';

export default function allowedVoter() {

    const [fileUrl, setFileUrl] = useState(null);
    const [formInput, setFormInput] = useState({
        name: '',
        address: '',
        position: ''
    });

    const router = useRouter();
    const { uploadToIPFS, createVoter, voterArray, getAllVoterData } = useContext(VotingContext);

    const onDrop = useCallback(async (acceptedFiles) => {
        const url = await uploadToIPFS(acceptedFiles[0]);
        setFileUrl(url);
    }, [uploadToIPFS]);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: 'image/*',
        maxSize: 50000000,
    });
    useEffect(() => {
        getAllVoterData();
    }, []);

    return (
        <div className='w-[95%] mx-auto my-2 grid grid-cols-1 sm:grid-cols-[1fr_3fr_1fr] gap-[2rem] '>
            <div >
                {fileUrl && (
                    <div className='h-fit top-12 left-3 p-[2rem] bg-[#231e39] rounded-lg shadow-[0_4px_6px_rgba(0,0,0,0.35)] text-[#6596c4] text-start'>
                        <Image src={fileUrl} alt='Voter Image' layout="responsive" width={100} height={100} className='w-full rounded-lg' />
                        <div className='bg-[#231e39] rounded-lg shadow-[0_4px_6px_rgba(0,0,0,0.35)] text-[#6596c4] p-2 leading-relaxed'>
                            <p className='mb-2'>Name: <span> {formInput.name}</span></p>
                            <p className='mb-2'>Add: <span>{formInput.address.slice(0, 20)}</span></p>
                            <p className='mb-2'>Pos: <span>{formInput.position}</span></p>
                        </div>
                    </div>
                )}

                {!fileUrl && (
                    <div className='bg-[#231e39] px-[2rem] py-[1rem] rounded-lg text-[#6596c4] '>
                        <div>
                            <h4 className='bg-[#006aff] p-0.5 rounded-[0.2rem] text-xl font-bold mb-2'>Create candidate For Voting</h4>
                            <p className='mb-3'>Blockchain voting orgainzation, provide etherum blockchain system</p>
                            <h4 className='bg-[#006aff] p-0.5 rounded-[0.2rem] text-xl font-bold mb-2 w-full'>Contract Candidate List</h4>
                        </div>
                        <div className='grid grid-cols-2 gap-1'>

                            {voterArray.map((el, i) => (
                                <div key={i + 1} className='leading-relaxed border border-[#006aff] rounded-lg shadow-[0_4px_6px_rgba(0,0,0,0.35)] '>
                                    <div className='w-full'>
                                        <Image src={el[2]} alt='Profile photo' width={200} height={200} className='rounded-lg p-1' />
                                    </div>
                                    <div className='p-2'>
                                        <p>{el[1]}</p>
                                        <p>Address: {el[3].slice(0, 8)}..</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className='bg-[#231e39] rounded-lg shadow-[0_4px_6px_rgba(0,0,0,0.35)] text-[#6596c4] p-[2rem] '>
                <div>
                    <h1 className=' p-0.5 text-2xl font-bold mb-2'>Create New Voter</h1>
                    <div className='mx-auto mb-5 w-[80%] border border-dotted border-[#006aff] rounded-lg text-center'>
                        <div>
                            <div {...getRootProps()}>
                                <input {...getInputProps()} />

                                <div>
                                    <p className='mb-3 mt-3 '>Upload File: JPG, PNG, GIF, WEBM Max 10MB</p>
                                    <Image src="/upload.png" width={150} height={150} objectFit='contain' alt='File Upload' className='mx-auto mb-3 rounded-2xl' />
                                </div>
                                <p className='mb-3'>Drag & Drop File</p>
                                <p className='mb-3'>or Browse Media on your device</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <Input inputType="text" title="Name" placeholder="Voter Name"
                        handleClick={(e) => setFormInput({ ...formInput, name: e.target.value })} />
                    <Input inputType="text" title="Address" placeholder="Voter Address"
                        handleClick={(e) => setFormInput({ ...formInput, address: e.target.value })} />
                    <Input inputType="text" title="Position" placeholder="Voter Position"
                        handleClick={(e) => setFormInput({ ...formInput, position: e.target.value })} />

                    <div className='flex justify-end'>
                        <Button btnName="Authorized Voter" handleClick={() => createVoter(formInput, fileUrl, router)} />

                    </div>
                </div>
            </div>

            <div className='bg-[#231e39] rounded-lg shadow-[0_4px_6px_rgba(0,0,0,0.35)] text-[#6596c4] p-[2rem] '>
                <div>
                    <Image src="/voter.png" width={150} height={150} alt='User Profile' className='mx-auto mb-2' />
                    <p className='mb-2'>Notice For User</p>
                    <p className='mb-2'>Organizer <span>0X939939..</span></p>
                    <p className='mb-2'>Only organizer of the voting contract can create voter and candidate for voting election</p>
                </div>
            </div>
        </div>

    )
}
