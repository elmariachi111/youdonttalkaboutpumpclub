import {
  ControlBar,
  GridLayout,
  LiveKitRoom,
  ParticipantTile,
  RoomAudioRenderer,
  useMaybeRoomContext,
  useTracks
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Track } from "livekit-client";
import SomeCanvas from "./SomeCanvas";
import { useCallback, useEffect, useState } from "react";

const serverUrl = "wss://pump-prod-tg2x8veh.livekit.cloud";
const token = "";


function App() {
  const [stream, setStream] = useState(null);

  return (
    <>
    <SomeCanvas setStream={(_stream) => {
      console.log("App Stream", _stream)
      setStream(_stream)
    }}/>
    <LiveKitRoom
      video={true}
      // audio={true}
      token={token}
      serverUrl={serverUrl}
      
    >
      {/* Your custom component with basic video conferencing functionality. */}
      {/* <MyVideoConference /> */}
      {/* The RoomAudioRenderer takes care of room-wide audio for you. */}
      <RoomAudioRenderer />
      <MyVideoConference stream={stream}/>
      {/* Controls for the user to start/stop audio, video, and screen
      share tracks and to leave the room. */}
      <ControlBar />
    </LiveKitRoom>
    </>
  );
}

function MyVideoConference(props) {

  const {stream} = props;
  // useEffect(() => {
  //   if (!stream) return; 

  //   const videoTracks = stream.getVideoTracks();
  //   // const pc1 = new RTCPeerConnection()
  //   // pc1.addTrack(videoTracks[0], stream)

  // },[stream])
  
  const room = useMaybeRoomContext();
  
  // `useTracks` returns all camera and screen share tracks. If a user
  // joins without a published camera track, a placeholder track is returned.
  const tracks = useTracks(
    [
      { source: Track.Source.ScreenShare, withPlaceholder: false },
      // { source: Track.Source.Camera, withPlaceholder: false },
      // { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false, room, video: true },
  );

  const publishClocks = useCallback(() => {
    if (!room) return;
    const videoTracks = stream.getVideoTracks();
    console.debug("VIDEO TRACKS", videoTracks)
    room.localParticipant.publishTrack(videoTracks[0], {
      source: Track.Source.Camera,
    });
    console.debug("0 published")
  }, [room, stream])

  return (
    <>
    <GridLayout tracks={tracks} style={{ height: 'calc(100vh - var(--lk-control-bar-height))' }}>
      {/* The GridLayout accepts zero or one child. The child is used
      as a template to render all passed in tracks. */}
      <ParticipantTile />
    </GridLayout>
    <button onClick={() => publishClocks()}>publish clocks</button>
    </>
  );
}

export default App;
