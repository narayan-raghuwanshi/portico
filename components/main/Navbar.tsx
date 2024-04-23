"use client"
import { SignIn, UserButton, useUser } from '@clerk/nextjs'
import { CiSquareChevRight } from "react-icons/ci";
import { IoMdMenu } from "react-icons/io";
import { MdOutlineClose } from "react-icons/md";
import Link from 'next/link'
import { useState } from 'react'


type navLink = {
    name: string,
    href: string
}
const navLinks: navLink[] = [
    { name: 'Contact', href: '/contact' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Dashboard', href: '/dashboard' },
]


const Navbar = () => {
    const [open, setOpen] = useState(false)
    const { isLoaded, isSignedIn, user } = useUser()
    return (
        <nav className='p-6 md:px-24 border-b'>
            <div className='flex justify-between items-center'>
                <Link href={'/'} className='text-3xl text-white font-semibold'>portico.</Link>
                <div className='hidden md:flex items-center gap-8'>
                    <NavbarContent navItems={navLinks} user={user} />
                </div>
                <button onClick={() => setOpen(!open)} className='md:hidden'>
                    {(open) ? (
                        <MdOutlineClose size={30} color='white' />
                    ) : (
                        <IoMdMenu size={30} color='white' />
                    )}
                </button>
            </div>
            <div className={`md:hidden ${open && 'mt-8'}`}>
                {(open) && (
                    <div className='flex flex-col-reverse gap-5'>
                        <NavbarContent navItems={navLinks} user={user} />
                    </div>
                )}
            </div>
        </nav>
    )
}

interface NavbarContentProps {
    navItems: typeof navLinks
    user: any
}

const NavbarContent = ({ navItems, user }: NavbarContentProps) => {
    return (
        <>
            {navItems.map((link, index) => (
                <Link href={link.href} key={index} className='font-semibold hover:text-[#adb5bd] transition duration-300'>{link.name}</Link>
            ))}
            {(user) ? (
                <div className='bg-[#f8f9fa] rounded-full p-1 w-fit'>
                    <UserButton />
                </div>
            ) : (
                <Link href={'/sign-in'} className='flex justify-between items-center gap-3  font-semibold outline outline-[#e9ecef] hover:bg-[#343a40] hover:scale-[102%] transition duration-300 px-4 py-2 rounded-md w-full'>
                    <span>Login</span>
                    <CiSquareChevRight size={25} className='md:hidden'/>
                </Link>
            )}

        </>
    )
}

export default Navbar