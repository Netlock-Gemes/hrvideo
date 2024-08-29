import React, { useState } from 'react';
import logo from './logo.png';
import VideoSelector from './components/VideoSelector/VideoSelector';
import SubtitleSelector from './components/SubtitleSelector/SubtitleSelector';
import VideoPlayer from './components/VideoPlayer/VideoPlayer';
import DirectorySelector from './components/DirectorySelector/DirectorySelector';
import { FaVideo } from "react-icons/fa";
import { FaEject } from "react-icons/fa";
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

    const handlePreviousVideo = () => {
        setCurrentVideoIndex((prevIndex) => {
            const previousIndex = (prevIndex - 1 + videoFiles.length) % videoFiles.length;
            setVideoSrc(videoFiles[previousIndex].url);
            setVideoName(videoFiles[previousIndex].name);
            return previousIndex;
        });
    };


    const handlePlaylistVideoSelect = (index) => {
        setCurrentVideoIndex(index);
        setVideoSrc(videoFiles[index].url);
        setVideoName(videoFiles[index].name);
    };

    let body = (
        <>
            <div className='flex flex-col justify-center items-center text-secondary pt-16 sm:px-0 px-7'>
                <h2 className='font-bold sm:text-2xl text-lg sm:w-1/2 mt-3'>
                    Why download a video player when you can simply play your videos
                    with the browser?
                </h2>
                <h5 className='font-semibold sm:text-base text-xs'>
                    Your videos will not be uploaded anywhere, it's all happening on
                    your computer.
                </h5>
                <div className='flex flex-col sm:flex-row justify-center items-center gap-5 sm:mt-8 mt-10'>
                    <VideoSelector onVideoPicked={onVideoPicked} />
                    <DirectorySelector onFilesPicked={onFilesPicked} />
                </div>
            </div>
            <div className='text-secondary flex sm:flex-row flex-col mx-auto mt-8 sm:mt-12 max-w-2xl text-left text-sm gap-8 sm:gap-0 sm:px-0 px-5'>
                <div className='sm:w-1/2 flex flex-col gap-2'>
                    <p className='font-bold'>FEATURES</p>
                    <p>1. You can add subtitle files (SRT or WebVTT).</p>
                    <p>2. Easy to use keyboard controls</p>
                    <p>3. Increase volume to 400% (like you do in VLC)</p>
                </div>
                <div className='sm:w-1/2 flex flex-col gap-2'>
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
                    handleNextVideo={handleNextVideo}
                    handlePreviousVideo={handlePreviousVideo}
                />
                <div className='flex flex-col sm:flex-row justify-center'>
                    <div className='sm:w-1/2 w-full'>
                        <div className={`flex w-full justify-center items-center sm:gap-8 gap-2 mt-8 ${visibility}`}>
                            <SubtitleSelector onSubtitlePicked={setSubtitleSrc} />
                            <button onClick={exitVideo} className='sm:w-[40%] text-xs sm:text-base flex bg-secondary justify-center items-center rounded-full text-black px-6 py-3 font-semibold transition-all duration-300 ease-in-out hover:bg-secondary/70 hover:shadow-[0px_2px_1px_1px] hover:shadow-cyan-300 hover:scale-[1.02] gap-2'>
                                <FaEject className='sm:h-6 sm:w-6 h-4 w-4' />
                                <span>Exit | Eject File</span>
                            </button>
                        </div>
                        <p className='mt-3 mx-5 sm:mx-0 sm:text-sm text-xs text-secondary'>SRT and WebVTT Subtitle files supported | Press <b>Arrow Keys</b> for Volume and Skips</p>
                    </div>

                    <div className='my-5 sm:w-1/2 w-[85vw] flex flex-col items-center border border-slate-500 rounded-lg sm:mx-6 mx-auto'>
                        <h3 className='sm:text-2xl text-lg font-bold py-2 bg-secondary/20 text-teal-400 w-full'>Playlist</h3>
                        <ul className='list-none p-2 flex flex-col gap-0.5 justify-center items-center overflow-hidden text-secondary w-full border-t border-slate-300 sm:text-base text-sm'>
                            {videoFiles.map((file, index) => (
                                <li
                                    key={index}
                                    className={`flex items-center gap-4 py-2 px-3 w-full text-start rounded-lg cursor-pointer transition-all duration-200 ease-in-out ${index === currentVideoIndex ? 'bg-blue-400/20 font-bold' : 'hover:bg-secondary/10'}`}
                                    onClick={() => handlePlaylistVideoSelect(index)}
                                >
                                    <div className='flex sm:w-fit w-[8%]'>
                                        <FaVideo className='sm:w-6 sm:h-6 w-5 h-5' />
                                    </div>
                                    <span className='truncate break-words w-full'>
                                        {file.name}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </>
        );
    }

    return (
        <div className={`min-h-screen ${cutTheLights ? 'cursor-none' : 'cursor-auto'}`} onMouseMove={disableCutTheLights}>
            <header className={`flex justify-start sm:p-5 p-3 text-white ${visibility}`}>
                <div className='flex items-center'>
                    <div className='bg-[#a66efa] p-1.5 sm:w-9 sm:h-9 w-8 h-8 rounded-full flex justify-center items-center'>
                        <img src={logo} width='15px' alt='logo' className='w-5 h-5' />
                    </div>
                    <span className='ml-2 text-[#a66efa] sm:text-xl textlg font-bold cursor-default'>
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
