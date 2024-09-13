import React, { useEffect, useState, useRef } from 'react';
import { parseWebVTT } from './SubtitleParser';

const CustomSubtitleDisplay = ({ videoRef, subtitleSrc, videoContainer }) => {
    const [subtitles, setSubtitles] = useState([]);
    const [currentSubtitle, setCurrentSubtitle] = useState('');
    const [bottom, setBottom] = useState("bottom-2");
    const timeoutId = useRef(null);

    useEffect(() => {
        const fetchSubtitles = async () => {
            const response = await fetch(subtitleSrc);
            const text = await response.text();
            const parsedSubtitles = parseWebVTT(text);
            setSubtitles(parsedSubtitles);
        };

        fetchSubtitles();
    }, [subtitleSrc]);

    useEffect(() => {
        const video = videoRef.current;

        const updateSubtitle = () => {
            if (!video) return;
            const currentTime = video.currentTime;
            const currentCue = subtitles.find(cue => {
                const start = parseTime(cue.start);
                const end = parseTime(cue.end);
                return currentTime >= start && currentTime <= end;
            });
            setCurrentSubtitle(currentCue ? currentCue.text : '');
        };

        video.addEventListener('timeupdate', updateSubtitle);
        return () => {
            video.removeEventListener('timeupdate', updateSubtitle);
        };
    }, [subtitles, videoRef]);

    useEffect(() => {
        const adjustSubtitlePosition = () => {
            if (document.fullscreenElement === null) {
                setBottom("bottom-2");
            } else {
                setBottom("bottom-[7.2rem]");
            }
        };

        document.addEventListener('fullscreenchange', adjustSubtitlePosition);
        return () => {
            document.removeEventListener('fullscreenchange', adjustSubtitlePosition);
        };
    }, []);

    useEffect(() => {
        const handleMouseMove = () => {
            if (document.fullscreenElement !== null) {
                setBottom('bottom-[7.2rem]');
                if (timeoutId.current) {
                    clearTimeout(timeoutId.current);
                }
                return;
            }

            setBottom('bottom-[4.5rem]');
            if (timeoutId.current) {
                clearTimeout(timeoutId.current);
            }
            timeoutId.current = setTimeout(() => {
                setBottom('bottom-2');
            }, 2500);
        };

        videoContainer.addEventListener('mousemove', handleMouseMove);

        return () => {
            videoContainer.removeEventListener('mousemove', handleMouseMove);
            if (timeoutId.current) {
                clearTimeout(timeoutId.current);
            }
        };
    }, [videoContainer]);

    return currentSubtitle ? (
        <div className={`absolute ${bottom} text-xl left-0 w-full text-center text-white bg-black bg-opacity-70 p-2 transition-all duration-300`}>
            <span dangerouslySetInnerHTML={{ __html: currentSubtitle }} />
        </div>
    ) : null;
};

const parseTime = (timeString) => {
    const [hours, minutes, seconds] = timeString.split(':');
    return parseFloat(hours) * 3600 + parseFloat(minutes) * 60 + parseFloat(seconds);
};

export default CustomSubtitleDisplay;
