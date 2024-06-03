import React from "react";
import YouTube from "react-youtube";
import "./youtube.css";

interface YouTubeVideoProps {
  videoId: string;
}

function YouTubeVideo({ videoId }: YouTubeVideoProps) {
  const opts = {
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };

  const onReady = (event: any) => {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  };

  return (
    <div className="youtube-container">
      <YouTube videoId={videoId} opts={opts} onReady={onReady} />
    </div>
  );
}

export default YouTubeVideo;
