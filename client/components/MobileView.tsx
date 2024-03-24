import React from 'react'
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

const MobileView = () => {
  return (
    <main className="flex flex-col items-center">
        <div className="text-[10px] sm:text-[15px] w-full text-center mt-2">
          <p>You are now chatting with a random stranger</p>
          <p>You both speak the same language - English </p>
        </div>
     
      <div className="w-[100%] sm:w-[70%] max-h-screen flex flex-col ">
            <hr className="mt-2" />
        <div className="flex flex-col h-[48vh]">
          {/* Add your messages here */}
          <div className="mt-3">
            <div className="message">
              <p className="text-[10px] sm:text-sm">Stranger: Hello</p>
            </div>
            <div className="message">
              <p className="text-[10px] sm:text-sm">You: Hi</p>
            </div>
          </div>
        </div>
        <div className="h-[90px]  flex flex-row gap-3 items-center">
          <Button
            variant="default"
            className="h-full  rounded-sm"
            // onClick={() =>
            //   handleNext(
            //     peerConnection,
            //     localStreamRef,
            //     remoteStreamRef,
            //     socketRef
            //   )
            // }
          >
            Next
          </Button>
          <Textarea rows={4} />
          <Button variant="outline" className="h-full rounded-sm">
            Send
          </Button>
        </div>
      </div>
    </main>
  );
}

export default MobileView