/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useEffect, useState } from 'react';
import KeyboardVideoControls from '../CustomVideoControls/CustomVideoControls';
import VideoControls from '../VideoControls/VideoControls';
import CustomSubtitleDisplay from '../Subtitle/CustomSubtitleDisplay';

function VideoPlayer(props) {
    const { videoSrc, subtitleSrc, videoName, handleNextVideo, handlePreviousVideo } = props;
    const video = useRef(null);
    const [keyboardControls, setKeyboardControls] = useState(null);
    const [videoPlayerControls, setVideoControls] = useState(null);
    const [subtitles, setSubtitles] = useState(null);

    const videoContainer = useRef(null);

    useEffect(() => {
        if (video.current) {
            setKeyboardControls(
                <KeyboardVideoControls video={video.current} />
            );
        }

        if (video.current) {
            setVideoControls(
                <VideoControls
                    videoName={videoName}
                    video={video.current}
                    videoContainer={videoContainer.current}
                    handleNextVideo={handleNextVideo}
                    handlePreviousVideo={handlePreviousVideo}
                />
            );
        }
    }, [video]);


    useEffect(() => {
        if (subtitleSrc) {
            setSubtitles(
                <CustomSubtitleDisplay videoRef={video} subtitleSrc={subtitleSrc} videoContainer={videoContainer.current} />
            )
        }
    })

    return (
        <div className='relative w-full h-[70vh] bg-black border-t-2 border-b-2 border-[#47345c]' ref={videoContainer}>
            <video src={videoSrc} ref={video} autoPlay className='h-full w-full'>
                {/* <track kind='subtitles' src={subtitleSrc} default /> */}
            </video>
            {subtitles}
            {videoPlayerControls}
            {keyboardControls}
        </div>
    );
}

export default VideoPlayer;
