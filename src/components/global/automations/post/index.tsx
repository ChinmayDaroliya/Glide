import { useAutomationPosts } from '@/hooks/use-automations'
import { useQueryAutomationPosts } from '@/hooks/user-queries'
import React from 'react'
import TriggerButton from '../trigger-button'
import { InstagramPostProps } from '@/types/post.type'
import { CheckCircle } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import Loader from '../../loader'

type Props = {
    id: string
}

const PostButton = ({ id }: Props) => {

    const { data } = useQueryAutomationPosts()
    const { posts, onSelectPost, mutate, isPending } = useAutomationPosts(id)

    return (
        <TriggerButton label="Attach a post">
            {data?.status === 200 ? (
                <div className='flex flex-col gap-y-3 w-full'>
                    <div className='flex flex-wrap full gap-3'>
                        {data?.data?.map((post: InstagramPostProps) => (
                            <div className='relative w-4/12 aspect-square rounded-lg cursor-pointer overflow-hidden'
                                key={post.id}
                                onClick={() =>
                                    onSelectPost({
                                        postid: post.id,
                                        media: post.media_url,
                                        mediaType: post.media_type,
                                        caption: post.caption,
                                    })
                                }
                            >
                                {posts.find((p: any) => p.postid === post.id) && (
                                    <CheckCircle
                                        fill='white'
                                        stroke='black'
                                        className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50'
                                    />
                                )}
                                <Image
                                    fill
                                    sizes='100vw'
                                    src={post.media_url || "/placeholder.png"}
                                    alt='post image'
                                    className={cn(
                                        'hover:opacity-75 transition duration-100',
                                        posts.find((p: any) => p.postid === post.id) && 'opacity-75'
                                    )}
                                />
                            </div>
                        ))}
                    </div>
                    <Button onClick={mutate} disabled={posts.length === 0}
                        className='bg-gradient-to-br w-full from-[#3352CC] font-medium text-white to-[#1C2D70]'>
                        <Loader state={isPending}>Attach Post</Loader>
                    </Button>
                </div>
            ) : (
                <div className='flex flex-col gap-y-3 w-full text-center'>
                    <p className='text-text-secondary'>No posts found</p>
                    {/* Render the error message gracefully so you can see exactly why it fails */}
                    {data?.status !== 200 && data?.message && (
                        <div className='bg-red-50 p-3 rounded-md border border-red-200 mt-2 text-left'>
                            <p className='text-xs text-red-600 font-mono break-words whitespace-pre-wrap'>
                                Error: {typeof data.message === 'string' ? data.message : JSON.stringify(data.message)}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </TriggerButton>
    )
}

export default PostButton
