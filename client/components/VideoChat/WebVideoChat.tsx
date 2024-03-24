
const WebVideoChat = ({
    localStreamRef,
    remoteStreamRef,
    }: {
    localStreamRef: React.MutableRefObject<HTMLVideoElement | null>;
    remoteStreamRef: React.MutableRefObject<HTMLVideoElement | null>;
  }) => {
  console.log(`ref -> ${remoteStreamRef}`);
  return (
    <div className="w-[42%] sm:w-[28%] flex">
      <div className="flex flex-col w-full">
        <video
          ref={localStreamRef}
          autoPlay
          muted
          className={`${
            localStreamRef ? `bg-white` : `bg-neutral-700`
          } max-h-[40vh] w-full `}
        />
        <video
          ref={remoteStreamRef}
          className={`
             bg-neutral-700
             ${remoteStreamRef ? `bg-white` : `bg-neutral-700`}
          max-h-[40vh] w-full border-t-2 border-white`}
          autoPlay
          playsInline
        />
      </div>
    </div>
  );
}

export default WebVideoChat