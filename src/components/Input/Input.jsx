// filepath: d:\Nam3\Seminar\PoC\votingapp\src\components\Input\Input.jsx
import React from 'react';

export const Input = ({ inputType, title, placeholder, handleClick }) => { 
    return (
        <div className='mb-3'>
            <p className="font-bold uppercase">{title}</p>
            {inputType === "text" ? (
                <div className="p-2 w-full bg-[#009dff] rounded-lg">
                    <input
                        className="bg-transparent outline-none border-none text-white px-5 py-2 placeholder:text-[#006aff] placeholder:font-medium placeholder:capitalize w-full"
                        type="text"
                        placeholder={placeholder}
                        onChange={handleClick} // Đổi từ onClick thành onChange
                    />
                </div>
            ) : (
                ""
            )}
        </div>
    );
};