'use client'

import { ChevronRight, PencilIcon, ArrowLeft } from 'lucide-react'
import React from 'react'
import ActivateAutomationButton from '../../activate-automation-button'
import { useQueryAutomation } from '@/hooks/user-queries'
import { useEditAutomation } from '@/hooks/use-automations'
import { useMutationDataState } from '@/hooks/use-mutation-data'
import { Input } from '@/components/ui/input'


type Props = {
    id:string
}

const AutomationsBreadCrumb = ({id}: Props) => {
    // WIP get the automation data
    const {data} = useQueryAutomation(id)
    const {edit,enableEdit,isPending, inputRef, mutate} = useEditAutomation(id)

    const {latestVariable} = useMutationDataState(['update-automation'])
    // user mutaion stuff to update the automations

    const handleGoBack = () => {
        window.history.back()
    }
     
  return (
    <div className='rounded-full w-full p-5 bg-[#18181B1A] flex items-center'>
        <div className='flex items-center gap-x-3 min-w-0'>
            <button
                onClick={handleGoBack}
                className='flex items-center justify-center p-2 rounded-lg hover:bg-[#18181B40] transition-colors duration-200 flex-shrink-0'
                aria-label='Go back to automations'
            >
                <ArrowLeft size={18} className='text-[#9B9CA0]' />
            </button>
            <p className='text-[#9B9CA0] truncate'>Automations</p>
            <ChevronRight className='flex-shrink-0' color='#9B9CA0'/>
            <span className='flex gap-x-3 items-center min-w-0'>
                {edit? (
                    <Input 
                    key="edit-input"
                    ref={inputRef} 
                    defaultValue={data?.data?.name || "Untitled"} //added
                    // placeholder={
                    //     isPending && latestVariable?.variables ? latestVariable.variables.name : 'Add a new name'
                    // }
                    placeholder='Add a new name'               
                    className='bg-transparent h-auto outline-none text-base border-none p-0'
                    autoFocus   
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault()
                            if (inputRef.current?.value) {
                                mutate({name: inputRef.current.value})
                            }
                        }
                    }}
                    />
                ):(
                    <p key="display-name" className='text-[#9B9CA0] truncate'>
                        {latestVariable?.variables
                            ? latestVariable?.variables.name
                            : data?.data?.name || 'Untitled'}
                    </p>
                )}
                
                {!edit && (
                    <span 
                        key="edit-button"
                        className='cursor-pointer hover:opacity-75 duration-100 transition flex-shrink-0 mr-2' 
                        onClick={enableEdit}
                    >
                        <PencilIcon size={14}/>
                    </span>
                )}
            </span>
        </div>
        <div className='flex items-center gap-x-5 ml-auto'>
            <p className='hidden md:block text-text-secondary/60 text-sm truncate min-w-0'>
                All posts are automatically saved 
            </p>
            <div className='flex gap-x-5 flex-shrink-0'>
                <p className='text-text-secondary text-sm truncate min-w-0 '>Changes Saved </p>
                
            </div>

        </div>

            <ActivateAutomationButton id={id}/>
    </div>
  )
}

export default AutomationsBreadCrumb
