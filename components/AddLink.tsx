import { UserData } from '@/app/dashboard/page'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { z } from 'zod'


const schema = z.object({
    title: z.string().min(1, { message: 'Title is required' }),
    href: z.string().url({ message: 'Invalid URL' }),
    description: z.string()
})

interface LinksComponentProps {
    userData: UserData
}

const AddLink = ({ userData }: LinksComponentProps) => {
    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) })

    const handleLinkAdd = async (data:FieldValues) => {
        const response = await fetch('/api/add-link', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: userData.email,
                link: {
                    title: data.title,
                    href: data.href,
                    description: data.description
                }
            })
        })
        if (response.ok) {
            const data = await response.json()
            console.log("Driasi", data);
        }
    }
    return (
        <div className='flex justify-center'>
            <form onSubmit={handleSubmit(handleLinkAdd)} className='flex flex-col gap-3 mt-10'>
                <div className='flex flex-col w-full gap-1 items-start'>
                    {errors.title && (<p className="text-red-400 text-xs">{errors.title.message?.toString()}</p>)}
                    <input type="text" id='title' {...register("title")} placeholder='Enter title' className='h-16 px-6 rounded-lg bg-[#212529] border border-[#e9ecef] placeholder:text-[#6c757d]' />
                </div>
                <div className='flex flex-col w-full gap-1 items-start'>
                    {errors.href && (<p className="text-red-400 text-xs">{errors.href.message?.toString()}</p>)}
                    <input type="text" id='href' {...register("href")} placeholder='Enter url' className='h-16 px-6 rounded-lg bg-[#212529] border border-[#e9ecef] placeholder:text-[#6c757d]' />
                </div>
                <div className='flex flex-col w-full gap-1 items-start'>
                    {errors.description && (<p className="text-red-400 text-xs">{errors.description.message?.toString()}</p>)}
                    <input type="text" id='description' {...register("description")} placeholder='Enter description' className='h-16 px-6 rounded-lg bg-[#212529] border border-[#e9ecef] placeholder:text-[#6c757d]' />
                </div>
                <button type='submit' className='bg-[#e9ecef] text-[#212529] shadow-md shadow-white px-10 font-semibold h-14 rounded-lg hover:scale-[103%] hover:bg-[#ced4da] transition duration-300'>Add Link</button>
            </form>
        </div>
    )
}

export default AddLink