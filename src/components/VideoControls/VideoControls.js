/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from 'react';
import fullscreenIcon from '../../expand.svg';
import disableFullscreenIcon from '../../compress.svg';
import { secondsToTime } from '../CustomVideoControls/time';
import { IoPlaySharp, IoPlaySkipBackSharp, IoPlaySkipForwardSharp, IoPauseSharp } from 'react-icons/io5';
import { FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import { RiFullscreenExitFill, RiFullscreenFill } from 'react-icons/ri';
import '../../App.css';

let timeoutHandle = null;

const VideoControls = (props) => {
    const { video, videoContainer, videoName } = props;
    const [pausePlayIcon, setPauseplayIcon] = useState(<IoPlaySharp className='h-5 w-5' />);
    const [muteUnmuteIcon, setMuteUnmuteIcon] = useState(<FaVolumeUp className='h-5 w-5' />);
    const [enableDisableFullscreenIcon, setEnableDisableFullscreenIcon] = useState(<RiFullscreenFill className='h-5 w-5' />);
    const [totalDuration, setTotalDuration] = useState(secondsToTime(0));
    const [realTime, setRealTime] = useState(secondsToTime(0));

    const progress = useRef(null);
    const volumeSlider = useRef(null);
    const seek = useRef(null);
    const controls = useRef(null);
    const videoStorageKey = `vid--name--${videoName}`;

    const [bottom, setBottom] = useState("bottom-[9.3rem]")

    const playVideo = () => {
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    };

    useEffect(() => {
        video.addEventListener('loadedmetadata', () => {
            const timeLeftOff = localStorage.getItem(videoStorageKey);
            if (timeLeftOff !== null) {
                video.currentTime = Number(timeLeftOff);
            }

            setTotalDuration(secondsToTime(video.duration));
        });
        video.addEventListener('timeupdate', () => {
            setRealTime(secondsToTime(video.currentTime));
            const progressWidth = (video.currentTime / video.duration) * 100;
            progress.current.style.width = `${progressWidth}%`;
            localStorage.setItem(videoStorageKey, String(video.currentTime));
        });
        video.addEventListener('ended', () => {
            setPauseplayIcon(<IoPlaySharp className='h-5 w-5' />);
            localStorage.removeItem(videoStorageKey);
        });
        video.addEventListener('pause', () => {
            setPauseplayIcon(<IoPlaySharp className='h-5 w-5' />);
        });
        video.addEventListener('play', () => {
            setPauseplayIcon(<IoPauseSharp className='h-5 w-5' />);
        });
        video.addEventListener('click', () => {
            playVideo();
        });
        videoContainer.addEventListener('mousemove', () => {
            showControls();
            if (timeoutHandle) {
                clearTimeout(timeoutHandle);
            }

            timeoutHandle = setTimeout(hideControls, 3000);
        });
    }, [video, videoContainer]);

    useEffect(() => {
        const adjustControlPosition = () => {
            if (!controls?.current) return;
            if (document.fullscreenElement === null) {
                setBottom("bottom-[9.3rem]")
                setEnableDisableFullscreenIcon(<RiFullscreenFill className='h-5 w-5' />);
            } else {
                setBottom("bottom-[4rem]")
                setEnableDisableFullscreenIcon(<RiFullscreenExitFill className='h-5 w-5' />);
            }
        };

        document.addEventListener('fullscreenchange', adjustControlPosition);
        return () => {
            document.removeEventListener('keydown', adjustControlPosition);
        };
    }, []);

    const showControls = () => {
        controls.current?.classList.remove('opacity-0');
    };

    const hideControls = () => {
        controls.current?.classList.add('opacity-0');
    };

    const muteVideo = () => {
        video.muted = !video.muted;
        setMuteUnmuteIcon(video.muted ? <FaVolumeMute className='h-5 w-5' /> : <FaVolumeUp className='h-5 w-5' />);
    };

    const volumeChange = () => {
        video.volume = volumeSlider.current.value / 1;
        setMuteUnmuteIcon(video.volume === 0 ? <FaVolumeMute className='h-5 w-5' /> : <FaVolumeUp className='h-5 w-5' />);
    };

    const toggleFullscreen = () => {
        if (document.fullscreenElement === null) {
            videoContainer.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
        setEnableDisableFullscreenIcon(
            document.fullscreenElement ? fullscreenIcon : disableFullscreenIcon
        );
    };

    const scrub = (e) => {
        const seekPercentage =
            (e.nativeEvent.offsetX / seek.current.offsetWidth) * 100;
        video.currentTime = (video.duration * seekPercentage) / 100;
    };

    return (
        <div>
            <div
                className={`${bottom} backdrop-blur-md absolute left-1/2 transform -translate-x-1/2 bg-primary/70 rounded-lg px-4 py-2 w-11/12 md:w-3/5 flex flex-col items-center opacity-0 transition-opacity duration-300`}
                ref={controls}
            >
                <div
                    className='relative bg-gray-300 rounded-full cursor-pointer w-full h-1.5 mb-1 shadow-md transition-all duration-300 border border-slate-400'
                    onClick={scrub}
                    ref={seek}
                >
                    <div
                        className='absolute top-0 left-0 h-full bg-purple-800 rounded-full transition-all duration-100'
                        ref={progress}
                        style={{ width: '50%' }}
                    ></div>
                </div>
                <div className='flex items-center justify-between w-full'>
                    <div className='flex justify-start items-center text-white text-sm w-1/3 cursor-default'>
                        {realTime} / {totalDuration}
                    </div>
                    <div className='flex justify-center items-center gap-6 w-1/3 text-white'>
                        <button
                            onClick={playVideo}
                            className='flex items-center justify-center w-8 h-8 bg-transparent rounded-md cursor-pointer transition-colors duration-300 hover:text-teal-400'
                        >
                            <IoPlaySkipBackSharp className='h-5 w-5' />
                        </button>
                        <button
                            onClick={playVideo}
                            className='flex items-center justify-center w-8 h-8 bg-transparent rounded-md cursor-pointer transition-colors duration-300 hover:text-teal-400'
                        >
                            {pausePlayIcon}
                        </button>
                        <button
                            onClick={playVideo}
                            className='flex items-center justify-center w-8 h-8 bg-transparent rounded-md cursor-pointer transition-colors duration-300 hover:text-teal-400'
                        >
                            <IoPlaySkipForwardSharp className='h-5 w-5' />
                        </button>
                    </div>

                    <div className='flex w-1/3 justify-end items-center gap-3'>
                        <div className='flex justify-center items-center text-white'>
                            <button
                                onClick={muteVideo}
                                className='flex items-center justify-center w-8 h-8 bg-transparent rounded-md cursor-pointer transition-colors duration-300 hover:text-teal-400'
                            >
                                {muteUnmuteIcon}
                            </button>
                            <input
                                type='range'
                                ref={volumeSlider}
                                className='w-3/4 h-1 rounded-full appearance-none cursor-pointer'
                                min={0}
                                max={1}
                                step='0.1'
                                defaultValue={1}
                                onChange={volumeChange}
                            />
                        </div>
                        <button
                            onClick={toggleFullscreen}
                            className='flex items-center justify-center w-8 h-8 bg-transparent rounded-md cursor-pointer transition-colors duration-300 hover:text-teal-400 text-white'
                        >
                            {enableDisableFullscreenIcon}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoControls;
