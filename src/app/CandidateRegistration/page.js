"use client";
import React, { useState, useEffect, useCallback, useContext } from 'react'
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';

import { VotingContext } from '@/context/Voter';
import { Button } from '@/components/Button/Button';
import { Input } from '@/components/Input/Input';

export default function candidateRegistration() {

    const [fileUrl, setFileUrl] = useState(null);
    const [candidateForm, setCandidateForm] = useState({
        name: '',
        address: '',
        age: ''
    });

    const router = useRouter();
    const { uploadToIPFS, setCandidate, getNewCandidate, candidateArray } = useContext(VotingContext);

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
        getNewCandidate();
    }, []);

    return (
        <div className='w-[95%] mx-auto my-2 grid grid-cols-1 sm:grid-cols-[1fr_3fr_1fr] gap-[2rem] '>
            <div >
                {fileUrl && (
                    <div className='h-fit top-12 left-3 p-[2rem] bg-[#231e39] rounded-lg shadow-[0_4px_6px_rgba(0,0,0,0.35)] text-[#6596c4] text-start'>
                        <Image src={fileUrl} alt='Voter Image' layout="responsive" width={100} height={100} className='w-full rounded-lg' />
                        <div className='bg-[#231e39] rounded-lg shadow-[0_4px_6px_rgba(0,0,0,0.35)] text-[#6596c4] p-2 leading-relaxed'>
                            <p className='mb-2'>Name: <span>{candidateForm.name}</span></p>
                            <p className='mb-2'>Add: <span>{candidateForm.address.slice(0, 20)}</span></p>
                            <p className='mb-2'>Pos: <span>{candidateForm.age}</span></p>
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
                            
                            {candidateArray.map((el, i) => (
                                <div key={i+1} className='leading-relaxed border border-[#006aff] rounded-lg shadow-[0_4px_6px_rgba(0,0,0,0.35)] '>
                                    <div className='w-full'>
                                        <Image src={el[3]} alt='Profile photo' width={200} height={200} className='rounded-lg p-1'/>
                                    </div>
                                    <div className='p-2'>
                                        <p>{el[1]} #{Number(el[2])}</p>
                                        <p>Age: {el[0]}</p>
                                        <p>Address: {el[6].slice(0,10)}..</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className='bg-[#231e39] rounded-lg shadow-[0_4px_6px_rgba(0,0,0,0.35)] text-[#6596c4] p-[2rem] '>
                <div>
                    <h1 className=' p-0.5 text-2xl font-bold mb-2'>Create New Candidate</h1>
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
                    <Input inputType="text" title="Name" placeholder="Candidate Name"
                        handleClick={(e) => setCandidateForm({ ...candidateForm, name: e.target.value })} />
                    <Input inputType="text" title="Address" placeholder="Candidate Address"
                        handleClick={(e) => setCandidateForm({ ...candidateForm, address: e.target.value })} />
                    <Input inputType="text" title="Age" placeholder="Candidate Age"
                        handleClick={(e) => setCandidateForm({ ...candidateForm, age: e.target.value })} />

                    <div className='flex justify-end'>
                        <Button btnName="Authorized Candidate" handleClick={() => setCandidate(candidateForm, fileUrl, router)} />

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
