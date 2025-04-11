
export const Button = ({btnName, handleClick, classStypes}) => {
    return (
        <button className="my-2 bg-transparent border border-dotted border-[#006aff] px-4 py-2 text-[#006aff] font-bold rounded-lg cursor-pointer hover:bg-[#006aff] 
        hover:text-white transition-all duration-300 ease-in-out" 
        type="button" 
        onClick={handleClick}>
            {btnName}
        </button>
    )
}
