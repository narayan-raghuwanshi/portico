"use client"
import { useUser } from '@clerk/nextjs'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { set, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm } from 'react-hook-form';
import Links from '@/components/Links';
import Loader from '@/components/Loader';


const schema = z.object({
    username: z.string().min(1, { message: 'Username is required' })
})

type FormData = z.infer<typeof schema>

export type UserData = {
    id: string,
    name: string,
    email: string,
    username: string,
    heading: string,
    description: string,
}

const Dashboard = () => {
    const [userData, setUserData] = useState<UserData>()
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const { user, isSignedIn, isLoaded } = useUser()
    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) })

    useEffect(() => {
        if (user) {
            const getUserFunction = async () => {
                const response = await fetch('/api/get-user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email: user.emailAddresses[0].emailAddress })
                })
                if (response.ok) {
                    const data = await response.json()
                    setUserData(data.user)
                }
                setLoading(false)
            }
            getUserFunction()
        }
    }, [setUserData, user])

    if (loading) return (
        <Loader />
    )

    const createUser = async (data: FieldValues) => {
        const body = {
            name: user?.fullName,
            email: user?.emailAddresses[0].emailAddress,
            username: data.username
        }
        const response = await fetch('/api/create-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        if (response.ok) {
            const data = await response.json()
            setUserData(data.user)
        }
    }

    if (!userData) {
        return (
            <div className='flex justify-center px-8'>
                <div>
                    <div className='flex flex-col space-y-2 md:space-y-4 items-center text-center pt-24'>
                        <p className='text-3xl md:text-6xl font-semibold text-[#f8f9fa]'>Get your username.</p>
                        <p className='text-[#adb5bd] max-w-4xl text-sm md:text-lg'>Think of a unique username. Remember, it's what people will use to find your portfolio online. So, make sure it stands out and represents you well.</p>
                    </div>
                    <form onSubmit={handleSubmit(createUser)} className='flex flex-col md:flex-row gap-5 mt-10 '>
                        <div className='flex flex-col w-full gap-3'>
                            <input type="text" id='username'{...register("username")} placeholder='Enter username' className='h-14 w-full px-6 rounded-full bg-[#212529] border border-[#e9ecef] placeholder:text-[#6c757d] shadow-md shadow-white' />
                            {errors.username && (<p className="text-red-400 text-sm md:text-sm ml-4">*{errors.username.message?.toString()}</p>)}
                        </div>
                        <button type='submit' className='bg-[#e9ecef] text-[#212529] shadow-md shadow-white px-10 font-semibold h-14 rounded-full hover:scale-[103%] hover:bg-[#ced4da] transition duration-300'>Create</button>
                    </form>
                </div>
            </div>
        )
    }

    return (
        <div className='flex justify-center px-8'>
            <div>
                <div className='flex flex-col space-y-2 md:space-y-4 items-center text-center'>
                    <div>
                        <Links userData={userData} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
