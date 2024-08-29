import React, { useRef, useState } from 'react';
import { FaVideo } from "react-icons/fa";

function VideoSelector(props) {
    const { onVideoPicked } = props;
    const [dragActive, setDragActive] = useState(false);
    const fileField = useRef(null);
    const onClick = () => {
        if (!fileField.current) {
            return;
        }
        fileField.current.value = '';
        fileField.current.click();
    };

    const onFileAdded = (e) => {
        if (!e.target.files) {
            return;
        }

        const file = e.target.files[0];
        const videoName = file.name;
        const objectURL = URL.createObjectURL(file);
        onVideoPicked(objectURL, videoName);
    };

    const onDrag = (e) => {
        console.log('dragging');
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const onDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!e.dataTransfer.files || !e.dataTransfer.files[0]) {
            return;
        }

        const file = e.dataTransfer.files[0];
        const videoName = file.name;
        const objectURL = URL.createObjectURL(file);
        onVideoPicked(objectURL, videoName);
    };

    return (
        <div
            onDrop={onDrop}
            onDragEnter={onDrag}
            onDragOver={onDrag}
            onDragLeave={onDrag}
        >
            <div
                style={{
                    border: 'pink 2px solid',
                    position: 'absolute',
                    inset: '-20%',
                    display: dragActive ? 'block' : 'none',
                }}
            />
            
            <button onClick={onClick} className='sm:w-64 w-56 flex bg-secondary justify-center items-center rounded-full text-black sm:px-6 sm:py-4 px-3 py-2 my-8 text-xl font-semibold transition-all duration-300 ease-in-out hover:bg-secondary/70 hover:shadow-[0px_2px_1px_1px] hover:shadow-cyan-300 hover:scale-[1.02] gap-2'>
                <FaVideo className='h-6 w-6' />
                <span>Select Video File</span>
            </button>
            <input
                type='file'
                ref={fileField}
                hidden={true}
                accept='video/mp4,video/x-m4v,video/*,.mkv'
                onChange={onFileAdded}
            />
        </div>
    );
}

export default VideoSelector;
