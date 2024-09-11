import {
  ControlBar,
  GridLayout,
  LiveKitRoom,
  ParticipantTile,
  RoomAudioRenderer,
  useMaybeRoomContext,
  useTracks,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Track } from "livekit-client";
import { useCallback, useState } from "react";
import SomeCanvas from "./SomeCanvas";

const serverUrl = "wss://pump-prod-tg2x8veh.livekit.cloud";
//extract from pumpfun cookie:
const pumpfunAuthToken = "";

const creator = "DrZ9tDQ537V3VpvQUGpanATSSuDuYvWCjpAD1KgZk6Ut";
const room1 = "BsZktVTLj1uL5e7za73mqa5ccAUzx6iDqh5JATgspump"; // $CYC

function App() {
  const [stream1, setStream1] = useState(null);
  const [stream2, setStream2] = useState(null);

  const [livekitToken1, setLivekitToken1] = useState();
  const [livekitToken2, setLivekitToken2] = useState();

  //ask for a livekit token
  //this oc is CORS protected so you'll need to fetch it from a proxy
  const fetchLivekitToken = async (roomId) => {
    const cookie = `auth_token=${pumpfunAuthToken}`
    const url = `http://frontend-api.pump.fun/livestreams/livekit/token/host?mint=${roomId}&creator=${creator}`
    console.log(url)
    const resp = await fetch({
      url,
      method: "GET",
      headers: {
        cookie
      }
    })
    console.debug("resp", resp)
    setLivekitToken1(resp)
  }



  return (
    <>
      <SomeCanvas
        setStream={setStream1}
        images={{ folder: "/img/clocks", from: 1, to: 10 }}
      />
      {/* <SomeCanvas
        setStream={setStream2}
        images={{ folder: "/img/worms", from: 1, to: 10 }}
      /> */}

      <LiveKitRoom
        video={true}
        // audio={true}
        token={livekitToken1}
        serverUrl={serverUrl}
      >
        {/* Your custom component with basic video conferencing functionality. */}
        {/* <MyVideoConference /> */}
        {/* The RoomAudioRenderer takes care of room-wide audio for you. */}
        <RoomAudioRenderer />
        <MyVideoConference stream={stream1} />
        {/* Controls for the user to start/stop audio, video, and screen
      share tracks and to leave the room. */}
        <ControlBar />
      </LiveKitRoom>


    </>
  );
}

function MyVideoConference(props) {
  const { stream } = props;

  const room = useMaybeRoomContext();

  // `useTracks` returns all camera and screen share tracks. If a user
  // joins without a published camera track, a placeholder track is returned.
  const tracks = useTracks(
    [
      { source: Track.Source.ScreenShare, withPlaceholder: false },
      // { source: Track.Source.Camera, withPlaceholder: false },
      // { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false, room, video: false }
  );

  const publish = useCallback(() => {
    if (!room) return;
    const videoTracks = stream.getVideoTracks();
    console.debug("VIDEO TRACKS", videoTracks);
    room.localParticipant.publishTrack(videoTracks[0], {
      source: Track.Source.Camera,
    });
    console.debug("0 published");
  }, [room, stream]);

  return (
    <>
      <GridLayout
        tracks={tracks}
        style={{ height: "calc(100vh - var(--lk-control-bar-height))" }}
      >
        {/* The GridLayout accepts zero or one child. The child is used
      as a template to render all passed in tracks. */}
        <ParticipantTile />
      </GridLayout>
      <button onClick={() => publish()}>publish</button>
    </>
  );
}

export default App;
