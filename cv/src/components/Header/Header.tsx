

const Header = () => {
    return(
            <div className='px-4 py-4 flex items-center justify-around'>
                <p className='text-2xl text-grey font-bold hover:text-orange-500 transition-colors duration-300 ease-in-out cursor-pointer'>About</p>
                <p className='text-2xl text-grey font-bold hover:text-orange-500 transition-colors duration-300 ease-in-out cursor-pointer'>Skills</p>
                <p className='text-2xl text-grey font-bold hover:text-orange-500 transition-colors duration-300 ease-in-out cursor-pointer'>Works</p>
                <p className='text-2xl text-grey font-bold hover:text-orange-500 transition-colors duration-300 ease-in-out cursor-pointer'>Contact me</p>
           </div>
    );
};

export default Header;