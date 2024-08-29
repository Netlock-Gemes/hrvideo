import React from 'react';
import { FaFolderPlus } from "react-icons/fa";

function DirectorySelector({ onFilesPicked }) {

    const handleDirectoryPick = async () => {
        try {
            const directoryHandle = await window.showDirectoryPicker();
            const files = [];

            for await (const entry of directoryHandle.values()) {
                if (entry.kind === 'file') {
                    const file = await entry.getFile();
                    files.push({ name: file.name, url: URL.createObjectURL(file) });
                }
            }

            onFilesPicked(files);
        } catch (error) {
            console.error('Error picking directory:', error);
        }
    };


    return (
        <div>
            <button onClick={handleDirectoryPick} className='sm:w-64 w-56 sm:flex hidden bg-secondary justify-center items-center rounded-full text-black sm:px-6 sm:py-4 px-3 py-2 text-xl font-semibold transition-all duration-300 ease-in-out hover:bg-secondary/70 hover:shadow-[0px_2px_1px_1px] hover:shadow-cyan-300 hover:scale-[1.02] gap-2'>
                <FaFolderPlus className='h-6 w-6' />
                <span>
                    Select Directory
                </span>
            </button>
        </div>
    );
}

export default DirectorySelector;
