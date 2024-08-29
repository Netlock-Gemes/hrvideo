import React, { useRef } from 'react';
import srt2vtt from './srt2vtt';
import { FaRegClosedCaptioning } from "react-icons/fa";
import './SubtitleSelector.css';

function SubtitleSelector(props) {
  const { onSubtitlePicked } = props;
  const fileField = useRef(null);
  const onClick = () => {
    if (!fileField.current) {
      return;
    }
    // reset value, so 'onChange' always works
    fileField.current.value = '';
    fileField.current.click();
  };

  const onFileAdded = (e) => {
    if (!e.target.files) {
      return;
    }

    const file = e.target.files[0];
    if (!file.name.endsWith('.srt')) {
      // we'll assume it's vtt
      const objectURL = URL.createObjectURL(file);
      onSubtitlePicked(objectURL);
      return;
    }

    // .srt isn't support by browsers so we need to convert to vtt
    const reader = new FileReader();
    reader.onload = function (e) {
      const converted = srt2vtt(e.target.result);
      const objectURL = URL.createObjectURL(
        new Blob([converted], { type: 'text/vtt' })
      );
      onSubtitlePicked(objectURL);
    };

    reader.readAsText(file);
  };

  return (
    <>
      <button onClick={onClick} className='sm:w-[40%] text-xs sm:text-base flex bg-secondary justify-center items-center rounded-full text-black px-6 py-3 font-semibold transition-all duration-300 ease-in-out hover:bg-secondary/70 hover:shadow-[0px_2px_1px_1px] hover:shadow-cyan-300 hover:scale-[1.02] gap-2'>
        <FaRegClosedCaptioning className='sm:h-6 sm:w-6 h-4 w-4' />
        <span>
          Add Subtitle file
        </span>
      </button>
      <input
        type='file'
        ref={fileField}
        hidden={true}
        accept='.vtt,.srt'
        onChange={onFileAdded}
      />
    </>
  );
}

export default SubtitleSelector;
