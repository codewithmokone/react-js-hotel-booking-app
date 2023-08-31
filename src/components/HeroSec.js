import React from 'react';
import heropic from '../images/hero-section.jpg'



const Header = () => {
    return (
        <div className=" flex flex-col justify-center items-center ">
            <div className=" bg-[#0088a9] w-[1024px] h-[4px] "></div>
            <div className="w-[1024px] flex flex-col justify-center items-center">
                <img src={heropic} alt='banner' className="h-[350px] w-full" />
            </div>
        </div>
    )
}

export default Header;