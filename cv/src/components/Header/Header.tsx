import Link from 'next/link'

type LinkProps = {
    myPath: any;
    children: React.ReactNode;
}

const HeaderLink = (props: LinkProps) => {
    return (<Link href={props.myPath} className='px-2 py-2 text-2xl text-grey font-bold border border-solid rounded-full hover:bg-gradient-to-r from-green-400 to-blue-500 ease-in-out cursor-pointer'>{props.children}</Link>)
}

const Header = () => {
    return(
            <header className='border-b-4 z-50 px-7 py-7 flex flex-row items-center justify-around backdrop-blur-xl'>
                <HeaderLink myPath='/about'>About</HeaderLink>
                <HeaderLink myPath='/skills'>Skills</HeaderLink>
                <HeaderLink myPath='/works'>Works</HeaderLink>
                <HeaderLink myPath='/contact'>Contact me</HeaderLink>
           </header>
    );
};

export default Header;
