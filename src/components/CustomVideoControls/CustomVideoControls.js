/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from 'react';
import { getAmplifier } from './volume';
import { secondsToTime } from './time';

function CustomVideoControls(props) {
  const { video } = props;
  const [volumeMultiplier, setVolumeMultiplier] = useState(1);
  const [showVolume, setShowVolume] = useState(false);
  const [volumeDisplay, setVolumeDisplay] = useState(0);
  const [showVideoTime, setShowVideoTime] = useState(false);
  const [videoTimeDisplay, setVideoTimeDisplay] = useState('');
  const [amplifier, setAmplifier] = useState(null);

  const displayVolume = useCallback((newVolume) => {
    setVolumeDisplay(newVolume);
    setShowVolume(true);

    const timeoutId = setTimeout(() => {
      setShowVolume(false);
    }, 3000);

    return timeoutId;
  }, []);

  const displayVideoTime = useCallback((currentTime) => {
    setVideoTimeDisplay(`${secondsToTime(currentTime)} / ${secondsToTime(video.duration)}`);
    setShowVideoTime(true);

    const timeoutId = setTimeout(() => {
      setShowVideoTime(false);
    }, 3000);

    return timeoutId;
  }, [video.duration]);

  const playVideo = () => {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  useEffect(() => {
    const amp = getAmplifier(video);
    setAmplifier(amp);
  }, [video]);

  useEffect(() => {
    if (!amplifier) return;

    let volumeTimeoutId;

    const adjustVolume = (e) => {
      const UP_KEY = 38;
      const DOWN_KEY = 40;
      if (e.keyCode !== UP_KEY && e.keyCode !== DOWN_KEY) {
        return;
      }

      e.preventDefault();
      if (e.keyCode === UP_KEY) {
        if (video.volume < 1) {
          video.volume = Math.min(video.volume + 0.1, 1);
        } else if (volumeMultiplier < 4) {
          const newVolumeMultiplier = Math.min(volumeMultiplier + 0.1, 4);
          setVolumeMultiplier(newVolumeMultiplier);
          amplifier.amplify(newVolumeMultiplier);
        }
      } else if (e.keyCode === DOWN_KEY) {
        if (volumeMultiplier > 1) {
          const newVolumeMultiplier = Math.max(volumeMultiplier - 0.1, 1);
          setVolumeMultiplier(newVolumeMultiplier);
          amplifier.amplify(newVolumeMultiplier);
        } else if (video.volume > 0) {
          video.volume = Math.max(video.volume - 0.1, 0);
        }
      }

      const newVolumeDisplay = (video.volume * volumeMultiplier * 100).toFixed(0);
      
      if (volumeTimeoutId) {
        clearTimeout(volumeTimeoutId);
      }
      volumeTimeoutId = displayVolume(newVolumeDisplay);
    };

    document.addEventListener('keydown', adjustVolume);
    return () => {
      document.removeEventListener('keydown', adjustVolume);
      if (volumeTimeoutId) {
        clearTimeout(volumeTimeoutId);
      }
    };
  }, [video, amplifier, volumeMultiplier, displayVolume]);

  useEffect(() => {
    let videoTimeTimeoutId;

    const adjustVideoTime = (e) => {
      const FORWARD_KEY = 39;
      const BACKWARD_KEY = 37;
      if (e.keyCode !== FORWARD_KEY && e.keyCode !== BACKWARD_KEY) {
        return;
      }

      e.preventDefault();
      if (e.keyCode === FORWARD_KEY) {
        video.currentTime = Math.min(video.duration, video.currentTime + 5);
      } else if (e.keyCode === BACKWARD_KEY) {
        video.currentTime = Math.max(0, video.currentTime - 5);
      }

      if (videoTimeTimeoutId) {
        clearTimeout(videoTimeTimeoutId);
      }
      videoTimeTimeoutId = displayVideoTime(video.currentTime);
    };

    document.addEventListener('keydown', adjustVideoTime);
    return () => {
      document.removeEventListener('keydown', adjustVideoTime);
      if (videoTimeTimeoutId) {
        clearTimeout(videoTimeTimeoutId);
      }
    };
  }, [video, displayVideoTime]);

  useEffect(() => {
    const playOrPause = (e) => {
      const SPACEBAR_KEY = 32;
      if (e.keyCode !== SPACEBAR_KEY) {
        return;
      }
      e.preventDefault();
      playVideo();
    };

    document.addEventListener('keydown', playOrPause);
    return () => {
      document.removeEventListener('keydown', playOrPause);
    };
  }, [video]);

  return (
    <div className='absolute top-5 right-6 font-bold text-white'>
      {showVolume ? `${volumeDisplay}%` : showVideoTime ? videoTimeDisplay : null}
    </div>
  );
}

export default CustomVideoControls;