const HeaderLink = (props: String) => {
    return (<a className='px-2 py-2 text-2xl text-grey font-bold border border-solid rounded hover:text-orange-500 transition-colors duration-300 ease-in-out cursor-pointer'>{props.children}</a>)
}

const Header = () => {
    return(
            <header className='px-4 py-4 flex flex-row items-center justify-around'>
                <HeaderLink>About</HeaderLink>
                <HeaderLink>Skills</HeaderLink>
                <HeaderLink>Contact me</HeaderLink>
           </header>
    );
};

export default Header;