import React from 'react'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'

function ChatPanel() {
  return (
      <main className='w-[100%]  flex flex-row justify-between' >
          <div className='w-[34%] chat-video-conatiner'>
            <div className='flex flex-col'>
              <video id='localUser' className='bg-neutral-700' autoPlay muted></video>
              <video id='remoteUser' className='bg-neutral-700 border-t-2 border-white' autoPlay></video>
            </div>
          </div>
          <hr/>
          <div className='w-[64%] chat-text-container flex flex-col justify-between'>
              <div className='chat-box w-[100%]'>
                  <p>You are now chatting with a random stranger</p>
                  <p>You both speak the same language - English </p>
                  <hr className='mt-2'/>
              </div>
              <div className='messages-area'>
              </div>
              <div className='text-chat-area flex flex-row gap-3 mt-3 items-center'>
                  <Button size="lg" variant="outline" className='h-full'>Next</Button>
                  <Textarea  />
                  <Button size="lg" variant="outline" className='h-full'> Send </Button>
              </div>
          </div>
      </main>
  )
}

export default ChatPanel

