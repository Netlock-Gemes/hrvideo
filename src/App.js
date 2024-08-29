import React, { useState } from 'react';
import logo from './logo.png';
import eject from './ejecticon.png';
import VideoSelector from './components/VideoSelector/VideoSelector';
import SubtitleSelector from './components/SubtitleSelector/SubtitleSelector';
import VideoPlayer from './components/VideoPlayer/VideoPlayer';
import DirectorySelector from './components/DirectorySelector/DirectorySelector';
import './CustomScrollbar.css';

function App() {
    const [videoFiles, setVideoFiles] = useState([]);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [cutTheLights, setCutTheLights] = useState(false);
    const [subtitleSrc, setSubtitleSrc] = useState('');
    const [videoName, setVideoName] = useState('');
    const [videoSrc, setVideoSrc] = useState('');

    const onVideoPicked = (videoUrl, videoName) => {
        setVideoFiles([{ url: videoUrl, name: videoName }]);
        setCurrentVideoIndex(0);
        setVideoSrc(videoUrl);
        setVideoName(videoName);
    };

    const onFilesPicked = (files) => {
        setVideoFiles(files);
        setCurrentVideoIndex(0);
        if (files.length > 0) {
            setVideoSrc(files[0].url);
            setVideoName(files[0].name);
        }
    };

    const visibility = cutTheLights ? 'hidden' : 'visible';
    const disableCutTheLights = () => setCutTheLights(false);
    const exitVideo = () => setVideoFiles([]);

    const handleNextVideo = () => {
        setCurrentVideoIndex((prevIndex) => {
            const nextIndex = (prevIndex + 1) % videoFiles.length;
            setVideoSrc(videoFiles[nextIndex].url);
            setVideoName(videoFiles[nextIndex].name);
            return nextIndex;
        });
    };

    const handlePlaylistVideoSelect = (index) => {
        setCurrentVideoIndex(index);
        setVideoSrc(videoFiles[index].url);
        setVideoName(videoFiles[index].name);
    };

    let body = (
        <>
            <div className='flex flex-col justify-center items-center text-secondary pt-16'>
                <h2 className='font-bold text-2xl w-1/2 mt-3'>
                    Why download a video player when you can simply play your videos
                    with the browser?
                </h2>
                <h5 className='font-semibold'>
                    Your videos will not be uploaded anywhere, it's all happening on
                    your computer.
                </h5>
                <div className='flex justify-center items-center gap-5 mt-8'>
                    <VideoSelector onVideoPicked={onVideoPicked} />
                    <DirectorySelector onFilesPicked={onFilesPicked} />
                </div>
            </div>
            <div className='text-secondary flex mx-auto mt-12 max-w-2xl text-left text-sm'>
                <div className='w-1/2 flex flex-col gap-2'>
                    <p className='font-bold'>FEATURES</p>
                    <p>1. You can add subtitle files (SRT or WebVTT).</p>
                    <p>2. Easy to use keyboard controls</p>
                    <p>3. Increase volume to 400% (like you do in VLC)</p>
                </div>
                <div className='w-1/2 flex flex-col gap-2'>
                    <p className='font-bold'>WHY WAS THIS BUILT?</p>
                    <p className=''>1. An abridged version of why HRWells' Video Player was built</p>
                    <p className=''>2. A more detailed version of why HRWells' Video Player was built.</p>
                </div>
            </div>
        </>
    );

    if (videoFiles.length > 0) {
        body = (
            <>
                <VideoPlayer
                    videoName={videoName}
                    videoSrc={videoSrc}
                    subtitleSrc={subtitleSrc}
                />
                <div className={`flex flex-col items-center gap-4 mt-4 ${visibility}`}>
                    <SubtitleSelector onSubtitlePicked={setSubtitleSrc} />
                    <button onClick={handleNextVideo} className='px-3 py-3 mx-2 w-[300px] border-3 border-[#555] rounded-lg font-bold bg-[#a66efa] text-white hover:opacity-90'>
                        Next Video
                    </button>
                    <button onClick={exitVideo} className='px-3 py-3 mx-2 w-[300px] border-3 border-[#555] rounded-lg font-bold bg-[#a66efa] text-white hover:opacity-90'>
                        <div className='flex items-center justify-center gap-1'>
                            <span>Exit | Eject</span>
                            <img src={eject} width='10px' height='10px' alt='eject' />
                        </div>
                    </button>
                    <p className='mt-4'>SRT and WebVTT Subtitle files supported | Press <b>Arrow Keys</b> for Volume and Skips</p>
                </div>
                <div className='mt-5 flex flex-col items-center'>
                    <h3 className='text-2xl font-bold mb-4'>Playlist</h3>
                    <ul className='list-none p-0 w-1/2'>
                        {videoFiles.map((file, index) => (
                            <li
                                key={index}
                                className={`py-2 cursor-pointer border-b border-gray-300 ${index === currentVideoIndex ? 'bg-gray-200 font-bold' : ''}`}
                                onClick={() => handlePlaylistVideoSelect(index)}
                            >
                                {file.name}
                            </li>
                        ))}
                    </ul>
                </div>
            </>
        );
    }

    return (
        <div className={`min-h-screen ${cutTheLights ? 'cursor-none' : 'cursor-auto'}`} onMouseMove={disableCutTheLights}>
            <header className={`flex justify-start p-5 text-white ${visibility}`}>
                <div className='flex items-center'>
                    <div className='bg-[#a66efa] p-1.5 w-9 h-9 rounded-full flex justify-center items-center'>
                        <img src={logo} width='15px' alt='logo' className='w-5 h-5' />
                    </div>
                    <span className='ml-2 text-[#a66efa] text-xl font-bold'>
                        HRWells' Video Player
                    </span>
                </div>
            </header>
            <div className='text-center'>
                {body}
            </div>
        </div>
    );
}

export default App;
