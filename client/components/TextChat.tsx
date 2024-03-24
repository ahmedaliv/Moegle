import { Button } from './ui/button';
import { handleNext } from '@/lib/webrtc';
import { Textarea } from './ui/textarea';
import useSocket from '@/app/hooks/useSocket';

const TextChat = ({
    peerConnection,
    localStreamRef,
    remoteStreamRef,
}: {
    peerConnection: React.MutableRefObject<RTCPeerConnection | undefined>;
    localStreamRef: React.MutableRefObject<HTMLVideoElement | null>;
    remoteStreamRef: React.MutableRefObject<HTMLVideoElement | null>;
}) => {
 const socketRef = useSocket({ peerConnection, localStreamRef });

  return (
    <div className="w-[56%] sm:w-[70%] flex flex-col">
      <div className="text-[10px] sm:text-[15px] w-full text-center">
        <p>You are now chatting with a random stranger</p>
        <p>You both speak the same language - English </p>
        <hr className="mt-2" />
      </div>
      <div className="flex flex-col mt-3 h-full">
        {/* Add your messages here */}
        <div className="message-container">
          <div className="message">
            <p className="text-[10px] sm:text-sm">Stranger: Hello</p>
          </div>
          <div className="message">
            <p className="text-[10px] sm:text-sm">You: Hi</p>
          </div>
        </div>
      </div>
      <div className="h-[30px] sm:h-[80px] flex flex-row gap-3 mb-3 items-center">
        <Button
          variant="default"
          className="h-full w-[50%] rounded-sm"
          onClick={() =>
            handleNext(
              peerConnection,
              localStreamRef,
              remoteStreamRef,
              socketRef
            )
          }
        >
          Next
        </Button>
        <Textarea />
        <Button variant="outline" className="h-full rounded-sm">
          Send
        </Button>
      </div>
    </div>
  );
}

export default TextChat