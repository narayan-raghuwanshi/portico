"use client"
import { SignIn, UserButton } from '@clerk/nextjs'
import { CiSquareChevRight } from "react-icons/ci";
import { CgMenuRound } from "react-icons/cg";
import { SlClose } from "react-icons/sl";
import Link from 'next/link'
import { useState } from 'react'

const navLinks: { name: string, href: string }[] = [
    { name: 'Contact', href: '/contact' },
    { name: 'Dashboard', href: '/dashboard' },
]

interface NavbarProps {
    user: any
}

const Navbar = ({ user }: NavbarProps) => {
    const [open, setOpen] = useState(false)
    return (
        <nav className='bg-black p-6 md:px-24 shadow-md'>
            <div className='flex justify-between items-center'>
                <Link href={'/'} className='text-2xl text-white font-semibold'>portico.</Link>
                <div className='hidden md:flex items-center gap-6'>
                    {navLinks.map((link, index) => (
                        <Link href={link.href} key={index} className='text-gray-200 font-semibold'>{link.name}</Link>
                    ))}
                    {!user && <Link href={'/sign-in'} className='bg-white text-black hover:scale-105 hover:bg-gray-100 transition duration-300 px-4 py-2 rounded-md'>Get started</Link>}
                    <UserButton />
                </div>
                <button onClick={() => setOpen(!open)} className='md:hidden'>
                    {open ? <SlClose size={30} color='white' /> : <CgMenuRound size={35} color='white' />}
                </button>
            </div>
            <div className={`md:hidden ${open && 'mt-6 pt-6 border-t border-white'}`}>
                {(open) && (
                    <div className='flex flex-col gap-4'>
                        <UserButton />
                        {navLinks.map((link, index) => (
                            <Link href={link.href} key={index} className='text-gray-200 font-semibold'>{link.name}</Link>
                        ))}
                        {!user && <Link href={'/sign-in'} className='flex justify-between items-center text-gray-200 font-semibold outline outline-white px-4 py-2 rounded-md'>
                            <span>Get Started</span>
                            <CiSquareChevRight size={20} color='white' />
                        </Link>}
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar