import { SignInButton, UserButton, useUser } from '@clerk/nextjs'
import React from 'react'
import Loader from '../loader'
import { Button } from '@/components/ui/button'
import { User } from 'lucide-react'

type Props = {}

const ClerkAuthState = (props: Props) => {
    const {isLoaded, isSignedIn} =  useUser()

    // Loading state
    if(!isLoaded){
        return (
            <Loader state>
                <></>
            </Loader>
        )
    }

    return (
        <>
            {!isSignedIn ? (
                <SignInButton>
                    <Button className='rounded-xl bg-[#252525] text-white hover:bg-[#252525]/70'>
                        <User/>
                        Login
                    </Button>
                </SignInButton>
            ):(
                <UserButton>
                    <UserButton.UserProfileLink
                        label='Dashboard'
                        url={`/dashboard`}
                        labelIcon={<User size={16}/>}
                    />
 
                </UserButton>
            )}
        </>
    )
}

export default ClerkAuthState