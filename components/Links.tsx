import React, { useEffect, useState } from 'react';
import Loader from './Loader';
import { UserData } from '@/app/(main)/dashboard/page';
import { FieldValues, useForm } from 'react-hook-form';
import { set, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FaGithub, FaLink, FaLinkedin } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { MdDelete } from 'react-icons/md';

interface LinkData {
    title: string;
    href: string;
    id?: string;
}

interface LinksComponentProps {
    userData: UserData;
}

const Links = ({ userData }: LinksComponentProps) => {
    const [links, setLinks] = useState<LinkData[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddLink, setShowAddLink] = useState(false); // State to control AddLink visibility
    const [selectedLink, setSelectedLink] = useState<LinkData | null>(null);
    const [heading, setHeading] = useState(userData.heading)
    const [description, setDescription] = useState(userData.description)

    useEffect(() => {
        const getLinks = async () => {
            const response = await fetch('/api/links', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: userData.email }),
            });
            if (response.ok) {
                const data = await response.json();
                setLinks(data.links);
            }
            setLoading(false);
        };
        getLinks();
    }, [userData, setLinks]);

    const handleAddLinkClick = () => {
        setSelectedLink(null); // Reset selectedLink when adding a new link
        setShowAddLink(true); // Show AddLink component when the button is clicked
    };

    const handleLinkClick = (link: LinkData) => {
        setSelectedLink(link); // Set the selected link when clicked
        setShowAddLink(true); // Show AddLink component with selected link data
    };

    const handleAddLinkClose = () => {
        setSelectedLink(null); // Reset selectedLink when AddLink component is closed
        setShowAddLink(false); // Hide AddLink component when it's closed
    };

    const getIcon = (title: string) => {
        switch (title.toLowerCase()) {
            case 'linkedin':
                return <FaLinkedin size={30} color='#0a66c2' />;
            case 'github':
                return <FaGithub size={30} />;
            case 'twitter':
                return <FaXTwitter size={30} />;
            default:
                return <FaLink size={30} />;
        }
    };

    const handleMetadataUpdate = async () => {
        const response = await fetch('/api/metadata', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: userData.email,
                heading: heading,
                description: description
            })
        });
        if (response.ok) {
            const data = await response.json();
            setHeading(data.heading)
            setDescription(data.description)
        }
    }

    if (loading) return <Loader />;

    return (
        <div className='flex flex-col items-start gap-16'>
            <div className='self-center flex gap-4 flex-wrap w-80 md:w-full justify-center md:justify-start'>
                <input
                    type="text"
                    id='heading'
                    value={heading}
                    onChange={(e) => { setHeading(e.target.value) }}
                    className='h-12 px-6 rounded-lg bg-[#212529] w-full border border-[#e9ecef] placeholder:text-[#6c757d]'
                />
                <input
                    type="text"
                    id='description'
                    value={description}
                    onChange={(e) => { setDescription(e.target.value) }}
                    className='h-12 px-6 rounded-lg bg-[#212529] border w-full border-[#e9ecef] placeholder:text-[#6c757d]'
                />
                <button onClick={handleMetadataUpdate} className='bg-[#e9ecef] text-[#212529] shadow-md shadow-white px-10 font-semibold h-12 rounded-lg hover:scale-[103%] hover:bg-[#ced4da] transition duration-300'>
                    Update
                </button>
            </div>
            <div className='flex gap-10 flex-wrap'>
                <div className='flex gap-3 max-w-sm flex-wrap self-start justify-center md:justify-start'>
                    {links.map((link, index) => (
                        <div className='flex justify-center gap-4 items-center'>
                            <div
                                className='bg-white text-black text-center w-40 text-lg px-10 py-2 rounded-md flex items-center hover:bg-gray-100 hover:scale-[102%] transition duration-300 cursor-pointer justify-center gap-5'
                                key={index}
                                onClick={() => handleLinkClick(link)} // Call handleLinkClick when a link is clicked
                            >
                                <span className='self-start'>{getIcon(link.title)}</span>
                                <span className=''>{link.title}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className='w-80 space-y-10'>
                    {(!showAddLink || selectedLink) && (
                        <button onClick={handleAddLinkClick} className='bg-[#e9ecef] text-[#212529] shadow-md shadow-white px-10 w-full font-semibold h-12 rounded-lg hover:scale-[103%] hover:bg-[#ced4da] transition duration-300'>
                            Add New Link
                        </button>
                    )}
                    {showAddLink && (
                        <AddLink userData={userData} onClose={handleAddLinkClose} selectedLink={selectedLink} setLinks={setLinks} links={links} />
                    )}
                </div>
            </div>
        </div>
    );
};

const schema = z.object({
    title: z.string().min(1, { message: 'Title is required' }),
    href: z.string().url({ message: 'Invalid URL' }),
});

interface AddLinkComponentProps {
    userData: UserData;
    onClose: any;
    selectedLink: LinkData | null; // Pass the selectedLink to AddLink component
    setLinks: any
    links: LinkData[]
}

const AddLink = ({ userData, onClose, selectedLink, setLinks, links }: AddLinkComponentProps) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

    useEffect(() => {
        if (selectedLink) {
            reset(selectedLink);
        } else {
            reset();
        }
    }, [selectedLink, reset]);

    const handleLinkAdd = async (data: FieldValues) => {
        const method = selectedLink ? 'PUT' : 'POST';
        if (method === 'PUT') {
            const response = await fetch('/api/link', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: userData.email,
                    link: {
                        title: data.title,
                        href: data.href,
                        id: selectedLink?.id,
                    }
                })
            });
            if (response.ok) {
                const data = await response.json();
                setLinks(links.map(link => link.id === selectedLink?.id ? data.link : link));
                onClose(false);
            }
        } else {
            const response = await fetch('/api/link', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: userData.email,
                    link: {
                        title: data.title,
                        href: data.href,
                    }
                })
            });
            if (response.ok) {
                const data = await response.json();
                setLinks([...links, data.link]);
                onClose(false);
            }
        }
    };

    const handleLinkDelete = async () => {
        const response = await fetch('/api/link', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: userData.email, link: selectedLink }),
        });
        if (response.ok) {
            const data = await response.json();
            setLinks(links.filter(link => link.id !== selectedLink?.id));
            onClose(false);
        }
    }

    return (
        <div className='flex justify-center w-80 flex-col gap-3'>
            <form onSubmit={handleSubmit(handleLinkAdd)} className='flex flex-row gap-3 flex-wrap'>
                <div className='flex flex-col w-full gap-1'>
                    <input
                        type="text"
                        id='title'
                        {...register("title")}
                        placeholder='Enter title'
                        className='h-12 px-6 rounded-lg bg-[#212529] border border-[#e9ecef] placeholder:text-[#6c757d]'
                    />
                    {errors.title && (<p className="text-red-400 text-xs self-start ml-1">{errors.title.message?.toString()}</p>)}
                </div>
                <div className='flex flex-col w-full gap-1'>
                    <input
                        type="text"
                        id='href'
                        {...register("href")}
                        placeholder='Enter url'
                        className='h-12 px-6 rounded-lg bg-[#212529] border border-[#e9ecef] placeholder:text-[#6c757d]'
                    />
                    {errors.href && (<p className="text-red-400 text-xs self-start ml-1">{errors.href.message?.toString()}</p>)}
                </div>
                <button
                    type='submit'
                    className='bg-[#e9ecef] text-[#212529] shadow-md shadow-white px-10 w-full font-semibold h-12 rounded-lg hover:scale-[103%] hover:bg-[#ced4da] transition duration-300'
                >
                    Save
                </button>
            </form>
            <div className='flex justify-between items-center w-full gap-3'>
                <button
                    onClick={onClose}
                    className='bg-[#e9ecef] text-[#212529] shadow-md shadow-white px-10 w-full font-semibold h-12 rounded-lg hover:scale-[103%] hover:bg-[#ced4da] transition duration-300'
                >
                    Cancel
                </button>
                {selectedLink && <button className='border border-gray-400 p-2 rounded-md' onClick={handleLinkDelete}>
                    <MdDelete size={30} color='#f16c6c' />
                </button>}
            </div>
        </div>
    );
};
export default Links;
