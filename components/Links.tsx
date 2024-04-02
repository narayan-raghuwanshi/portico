import { UserData } from '@/app/dashboard/page'
import React, { useEffect, useState } from 'react'
import AddLink from './AddLink'
import Loader from './Loader'

interface LinksComponentProps{
    userData: UserData
}

const Links = ({ userData }: LinksComponentProps) => {
    const [links, setLinks] = useState()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getLinks = async () => {
            const response = await fetch('/api/links', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: userData.email })
            })
            if (response.ok) {
                const data = await response.json()
                setLinks(data.links)
            }
            setLoading(false)
        }
        getLinks()
    }, [setLinks, userData])

    if (loading) return (
            <Loader/>
    )

    return (
        <div>
            <AddLink userData={userData} />
        </div>
    )
}

export default Links