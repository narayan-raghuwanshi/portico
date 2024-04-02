"use client"
import Loader from '@/components/Loader'
import { notFound } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface Props{
    params:{username:string}
}

type UserData = {
    heading: string
    description: string
    links: Object[]
    testimonialLinks: Object[]
}

const UserDetailPage = ({params:{username}}:Props) => {
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
  },[])
  if(loading) return (
    <Loader/>
  )
  if(!userData) notFound()
  return (
    <div>
      {userData.heading}
      {userData.description}
      {userData.links.map((link:any) => (
        <div>{link.title}</div>
      ))}
    </div>
  )
}

export default UserDetailPage