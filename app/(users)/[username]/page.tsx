"use client"
import Loader from '@/components/Loader'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { CgProfile } from 'react-icons/cg'
import { FaGithub, FaLink, FaLinkedin } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'

interface Props {
  params: { username: string }
}

type UserData = {
  heading: string
  description: string
  links: { title: string, href: string }[]
  testimonialLinks: any[]
}

const UserDetailPage = ({ params: { username } }: Props) => {
  const [userData, setUserData] = useState<UserData>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUserData = async () => {
      const response = await fetch(`/api/${username}`, {
        method: 'GET',
      })
      if (response.ok) {
        const data = await response.json()
        setUserData(data.userData)
      }
      setLoading(false)
    }
    getUserData()
  }, [])

  if (loading) return <Loader />
  if (!userData) notFound()

  const getIcon = (title: string) => {
    switch (title.toLowerCase()) {
      case 'linkedin':
        return <FaLinkedin size={30} color='#0a66c2' />
      case 'github':
        return <FaGithub size={30} />
      case 'twitter':
        return <FaXTwitter size={30} />
      default:
        return <FaLink size={30} />
    }
  }

  return (
    <div className='flex justify-center flex-col items-center gap-2'>
      <CgProfile size={90} />
      <h1 className='text-3xl font-semibold'>{userData.heading}</h1>
      <h1 className='text-gray-300'>{userData.description}</h1>
      <div className='flex flex-col gap-3 mt-10'>
        {userData.links.map((link, index) => (
          <Link target='_blank' className='bg-white text-black text-center min-w-96 text-lg px-10 py-2 rounded-xl flex items-center hover:bg-gray-100 hover:scale-[103%] transition duration-100' key={index} href={link.href}>
            <span className='self-start'>{getIcon(link.title)}</span>
            <span className='self-end w-full'>
              {link.title}
            </span>
          </Link>
        ))}
      </div>
      <div className='mt-16'>
        <Link href={'/dashboard'} className='text-white hover:text-sky-300 transition duration-300 bg-zinc-800 px-6 py-2 rounded-full border border-gray-600'>Get your portico.</Link>
      </div>
    </div>
  )
}

export default UserDetailPage
