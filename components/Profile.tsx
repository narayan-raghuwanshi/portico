import React from 'react'

interface ProfileProps{
    id: string
    email: string
    name: string
    username: string
    heading: string
    description: string
    links?: string[]
    testimonialLinks: string[]
}

const Profile = ({id,email,name,username,heading,description,links,testimonialLinks}:ProfileProps) => {
  return (
    <div>Profile</div>
  )
}

export default Profile