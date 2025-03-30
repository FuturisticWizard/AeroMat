// 'use client'
// import dynamic from 'next/dynamic';
// import React, { useState, useRef } from 'react';
// // import ReactPlayer from 'react-player';
// // Dynamically import ReactPlayer with SSR disabled
// const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

// import {
//     Button,
//     Slider,
//     FormattedTime,
//     PlayerIcon,
//     Direction
// } from 'react-player-controls';
// import './VideoPlayer.css';
// import PlayIcon from '../icons/PlayIcon';
// import PauseIcon from '../icons/PauseIcon';
// import SoundOn from '../icons/SoundOn';
// import SoundOff from '../icons/SoundOff';

// const VideoPlayer = ({ url }) => {
//     const [playing, setPlaying] = useState(false);
//     const [muted, setMuted] = useState(false);
//     const [volume, setVolume] = useState(0.5);
//     const [played, setPlayed] = useState(0);
//     const [duration, setDuration] = useState(0);
//     const playerRef = useRef(null);

//     const handlePlayPause = () => {
//         setPlaying(!playing);
//     };

//     const handleMute = () => {
//         setMuted(!muted);
//     };

//     const handleVolumeChange = (value) => {
//         setVolume(value);
//     };

//     const handleProgressChange = (value) => {
//         playerRef.current.seekTo(value);
//         setPlayed(value);
//     };

//     const handleProgress = (state) => {
//         setPlayed(state.played);
//     };

//     const handleDuration = (d) => {
//         setDuration(d);
//     };

//     // Styled Button Component
//     const StyledButton = ({ onClick, children, isEnabled = true }) => (
//         <Button
//             onClick={onClick}
//             isEnabled={isEnabled}
//             style={{
//                 appearance: 'none',
//                 outline: 'none',
//                 border: 'none',
//                 borderRadius: 3,
//                 background: 'rgba(255, 255, 255, 0.1)', // Semi-transparent white
//                 color: 'white',
//                 padding: '5px 10px',
//                 cursor: isEnabled ? 'pointer' : 'default',
//                 transition: 'background 0.2s ease',
//                 '&:hover': {
//                     background: 'rgba(255, 255, 255, 0.2)'
//                 }
//             }}
//         >
//             {children}
//         </Button>
//     );

//     return (
//         <div className="w-full  lsm:max-w-6xl mx-auto ">
//             <ReactPlayer
//                 ref={playerRef}
//                 url={url}
//                 playing={playing}
//                 muted={muted}
//                 volume={volume}
//                 controls={false}
//                 onProgress={handleProgress}
//                 onDuration={handleDuration}
//                 width="100%"
//                 height="100%"
//             />

//             <div className="controls">
//                 {/* Play/Pause Button */}
//                 <StyledButton onClick={handlePlayPause}>
//                     {playing ? <PauseIcon /> : <PlayIcon  />}
//                 </StyledButton>

//                 {/* Current Time / Duration */}
//                 <div className="time-display">
//                     <FormattedTime numSeconds={played * duration} /> / <FormattedTime numSeconds={duration} />
//                 </div>

//                 {/* Progress Bar */}
//                 <Slider
//                     direction={Direction.HORIZONTAL}
//                     value={played}
//                     onChange={handleProgressChange}
//                     style={{
//                         width: '50%',
//                         height: '8px',
//                         background: 'rgba(255, 255, 255, 0.2)',
//                         borderRadius: '4px'
//                     }}
//                 >
//                     <div
//                         style={{
//                             width: `${played * 100}%`,
//                             height: '100%',
//                             background: '#4CAF50', // Example: Green progress
//                             borderRadius: '4px'
//                         }}
//                     />
//                 </Slider>

//                 {/* Volume Control */}
//                 <StyledButton onClick={handleMute}>
//                     {muted ? <SoundOff /> : <SoundOn />}
//                 </StyledButton>
//                 <Slider
//                     direction={Direction.HORIZONTAL}
//                     value={volume}
//                     onChange={handleVolumeChange}
//                     style={{
//                         width: '10%',
//                         height: '8px',
//                         background: 'rgba(255, 255, 255, 0.2)',
//                         borderRadius: '4px'
//                     }}
//                 >
//                     <div
//                         style={{
//                             width: `${volume * 100}%`,
//                             height: '100%',
//                             background: '#ddd', // Example: Green progress
//                             borderRadius: '4px'
//                         }}
//                     />
//                 </Slider>
//             </div>
//         </div>
//     );
// };

// export default VideoPlayer;
// 'use client'
// import dynamic from 'next/dynamic';
// import React, { useState, useRef, useEffect } from 'react';
// import {
//     Button,
//     Slider,
//     FormattedTime,
//     Direction
// } from 'react-player-controls';
// import './VideoPlayer.css';
// import PlayIcon from '../icons/PlayIcon';
// import PauseIcon from '../icons/PauseIcon';
// import SoundOn from '../icons/SoundOn';
// import SoundOff from '../icons/SoundOff';
// import Expand from '../icons/Expand'; // Add expand/compress icons
// import Compress from '../icons/Compress';

// const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

// const useFullscreen = () => {
//     const [isFullscreen, setIsFullscreen] = useState(false);
//     const elementRef = useRef(null);


//     const toggleFullscreen = () => {
//         if (!document.fullscreenElement) {
//             if (elementRef.current?.requestFullscreen) {
//                 elementRef.current.requestFullscreen();
//             } else if (elementRef.current?.mozRequestFullScreen) { /* Firefox */
//                 elementRef.current.mozRequestFullScreen();
//             } else if (elementRef.current?.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
//                 elementRef.current.webkitRequestFullscreen();
//             } else if (elementRef.current?.msRequestFullscreen) { /* IE/Edge */
//                 elementRef.current.msRequestFullscreen();
//             }
//         } else {
//             if (document.exitFullscreen) {
//                 document.exitFullscreen();
//             } else if (document.mozCancelFullScreen) { /* Firefox */
//                 document.mozCancelFullScreen();
//             } else if (document.webkitExitFullscreen) { /* Chrome, Safari & Opera */
//                 document.webkitExitFullscreen();
//             } else if (document.msExitFullscreen) { /* IE/Edge */
//                 document.msExitFullscreen();
//             }
//         }
//     };

//     useEffect(() => {
//         const handleFullscreenChange = () => {
//             setIsFullscreen(!!document.fullscreenElement);
//         };

//         document.addEventListener('fullscreenchange', handleFullscreenChange);
//         document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
//         document.addEventListener('mozfullscreenchange', handleFullscreenChange);
//         document.addEventListener('MSFullscreenChange', handleFullscreenChange);

//         return () => {
//             document.removeEventListener('fullscreenchange', handleFullscreenChange);
//             document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
//             document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
//             document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
//         };
//     }, []);

//     return { elementRef, isFullscreen, toggleFullscreen };
// };

// const VideoPlayer = ({ url }) => {
//     const [playing, setPlaying] = useState(false);
//     const [muted, setMuted] = useState(false);
//     const [volume, setVolume] = useState(0.5);
//     const [played, setPlayed] = useState(0);
//     const [duration, setDuration] = useState(0);
//     const playerRef = useRef(null);
//     const { elementRef, isFullscreen, toggleFullscreen } = useFullscreen();
    
//     // Existing handlers remain the same...
//     const handlePlayPause = () => {
//         setPlaying(!playing);
//     };

//     const handleMute = () => {
//         setMuted(!muted);
//     };

//     const handleVolumeChange = (value: number) => {
//         setVolume(value);
//     };

//     const handleProgressChange = (value: number) => {
//         playerRef.current.seekTo(value);
//         setPlayed(value);
//     };


//     const handleProgress = (state: { played: number }) => {
//         setPlayed(state.played); // Update played fraction
//     };

//     const handleDuration = (duration: number) => {
//         setDuration(duration); // Update video duration
//     };
//     // Styled Button Component (updated with fullscreen button)
//     const StyledButton = ({ onClick, children, isEnabled = true }) => (
//         <Button
//             onClick={onClick}
//             isEnabled={isEnabled}
//             style={{
//                 appearance: 'none',
//                 outline: 'none',
//                 border: 'none',
//                 borderRadius: 3,
//                 background: 'rgba(255, 255, 255, 0.1)',
//                 color: 'white',
//                 padding: '5px 10px',
//                 cursor: isEnabled ? 'pointer' : 'default',
//                 transition: 'background 0.2s ease',
//                 '&:hover': {
//                     background: 'rgba(255, 255, 255, 0.2)'
//                 }
//             }}
//         >
//             {children}
//         </Button>
//     );

//     return (
//         <div className={`w-full lsm:max-w-6xl mx-auto ${isFullscreen ? 'fullscreen' : ''}`} ref={elementRef}>
//             <ReactPlayer
//                 ref={playerRef}
//                 url={url}
//                 playing={playing}
//                 muted={muted}
//                 volume={volume}
//                 controls={false}
//                 onProgress={handleProgress}
//                 onDuration={handleDuration}
//                 width="100%"
//                 height="100%"
//                 config={{
//                     file: {
//                         attributes: {
//                             playsInline: true,
//                             webkitplaysinline: "true"
//                         }
//                     }
//                 }}
//             />

//             <div className="controls">
//                 {/* Existing controls... */}
//                  {/* Play/Pause Button */}
//                 <StyledButton onClick={handlePlayPause}>
//                      {playing ? <PauseIcon /> : <PlayIcon  />}
//                  </StyledButton>

//                 {/* Current Time / Duration */}
//                  <div className="time-display">
//                      <FormattedTime numSeconds={played * duration} /> / <FormattedTime numSeconds={duration} />
//                  </div>

//                  {/* Progress Bar */}
//                  <Slider
//                     direction={Direction.HORIZONTAL}
//                     value={played}
//                     onChange={handleProgressChange}
//                     style={{
//                         width: '50%',
//                         height: '8px',
//                         background: 'rgba(255, 255, 255, 0.2)',
//                         borderRadius: '4px'
//                     }}
//                 >
//                     <div
//                         style={{
//                             width: `${played * 100}%`,
//                             height: '100%',
//                             background: '#4CAF50', // Example: Green progress
//                             borderRadius: '4px'
//                         }}
//                     />
//                 </Slider>

//                 {/* Volume Control */}
//                 <StyledButton onClick={handleMute}>
//                     {muted ? <SoundOff /> : <SoundOn />}
//                 </StyledButton>
//                 <Slider
//                     direction={Direction.HORIZONTAL}
//                     value={volume}
//                     onChange={handleVolumeChange}
//                     style={{
//                         width: '10%',
//                         height: '8px',
//                         background: 'rgba(255, 255, 255, 0.2)',
//                         borderRadius: '4px'
//                     }}
//                 >
//                     <div
//                         style={{
//                             width: `${volume * 100}%`,
//                             height: '100%',
//                             background: '#ddd', // Example: Green progress
//                             borderRadius: '4px'
//                         }}
//                     />
//                 </Slider>
//                   {/* Fullscreen Button */}
//                   <StyledButton onClick={toggleFullscreen}>
//                     {isFullscreen ? <Compress /> : <Expand />}
//                 </StyledButton>
//             </div>

//               {/* Fullscreen Button (Top Right) */}
//              {isFullscreen && (
//                 <div className="fullscreen-toggle" onClick={toggleFullscreen}>
//                     <StyledButton onClick={toggleFullscreen}>
//                        <Compress />
//                     </StyledButton>
//                 </div>
//             )}
//             </div>
//     );
// };

// export default VideoPlayer;

'use client'
import dynamic from 'next/dynamic';
import React, { useState, useRef, useEffect } from 'react';
import {
    Button,
    Slider,
    FormattedTime,
    Direction
} from 'react-player-controls';
import './VideoPlayer.css';

import PlayWhiteIcon from '../icons/PlayWhiteIcon';

import PauseWhiteIcon from '../icons/PauseWhiteIcon';

import SoundOnWhite from '../icons/SoundOnWhite';

import SoundOffWhite from '../icons/SoundOffWhite';
import MinimizeWhite from '../icons/MinimizeWhite';
import MaximizeWhite from '../icons/MaximizeWhite';
import { ReactPlayerProps } from 'react-player';

interface VideoPlayerProps {
    url: string; // Define the type for the `url` prop
  }

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

const useFullscreen = () => {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const elementRef = useRef<HTMLDivElement | null>(null);
    const toggleFullscreen = () => {
        if (!document.fullscreenElement && !document.webkitFullscreenElement && !isFullscreen) {
            if (elementRef.current?.requestFullscreen) {
                elementRef.current.requestFullscreen();
            } else if (elementRef.current?.webkitRequestFullscreen) {
                elementRef.current.webkitRequestFullscreen();
            } else if (elementRef.current) {
                // Fallback for iOS & mobile browsers
                elementRef.current.style.position = "fixed";
                elementRef.current.style.top = "0";
                elementRef.current.style.left = "0";
                elementRef.current.style.width = "100vw";
                elementRef.current.style.height = "100vh";
                elementRef.current.style.zIndex = "9999";
                setIsFullscreen(true);
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (elementRef.current) {
                // Remove mobile fullscreen fallback styles
                elementRef.current.style.position = "";
                elementRef.current.style.top = "";
                elementRef.current.style.left = "";
                elementRef.current.style.width = "";
                elementRef.current.style.height = "";
                elementRef.current.style.zIndex = "";
                setIsFullscreen(false);
            }
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    return { elementRef, isFullscreen, toggleFullscreen };
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url }) => {
    const [playing, setPlaying] = useState(false);
    const [muted, setMuted] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [played, setPlayed] = useState(0);
    const [duration, setDuration] = useState(0);
    const [controlsVisible, setControlsVisible] = useState(true);
    const playerRef = useRef<ReactPlayerProps | null>(null);
    const { elementRef, isFullscreen, toggleFullscreen } = useFullscreen();
    const hideControlsTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const showControls = () => {
        setControlsVisible(true);
        if (hideControlsTimeout.current) {
            clearTimeout(hideControlsTimeout.current);
        }
        hideControlsTimeout.current = setTimeout(() => setControlsVisible(false), 3000);
    };
    useEffect(() => {
        setVolume(0.5)
        const handleUserInteraction = () => showControls();
        const playerElement = elementRef.current;
        if (!playerElement) return;

        playerElement.addEventListener('mousemove', handleUserInteraction);
        playerElement.addEventListener('touchstart', handleUserInteraction);

        return () => {
            if (playerElement) {
                playerElement.removeEventListener('mousemove', handleUserInteraction);
                playerElement.removeEventListener('touchstart', handleUserInteraction);
            }
        };
    }, [elementRef]);

    return (
        <div
        className={`video-container justify-center items-center ${
            isFullscreen ? 'fullscreen' : ''
        }`}
        ref={elementRef}
    >
        <ReactPlayer
            ref={playerRef}
            url={url}
            playing={playing}
            muted={muted}
            volume={volume}
            controls={false}
            onProgress={({ played }) => setPlayed(played)}
            onDuration={setDuration}
            width="100%"
            height="100%"
            config={{
                file: { attributes: { playsInline: true, webkitplaysinline: 'true' } },
            }}
        />

<div className={`controls ${controlsVisible ? 'visible' : 'hidden'}`}>
    {/* Play/Pause Button */}
    <Button onClick={() => setPlaying(!playing)}>
        {playing ? <PauseWhiteIcon /> : <PlayWhiteIcon />}
    </Button>

    {/* Current Time / Duration */}
    <div className="time-display px-2">
        <FormattedTime numSeconds={played * duration} /> / <FormattedTime numSeconds={duration} />
    </div>

    {/* Timeline (Progress Bar) */}
        <Slider
            direction={Direction.HORIZONTAL}
            value={played} // Current playback progress (fraction)
            onChange={(v: number) => playerRef.current?.seekTo(v, 'fraction')} // Seek to the selected position
            style={{
                width: '100%',
                height: '8px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '4px',
                position: 'relative',
                cursor: 'pointer',
            }}
        >
            {/* Progress Indicator */}
            <div
                style={{
                    width: `${played * 100}%`, // Convert fraction to percentage
                    height: '100%',
                    background: '#4CAF50', // Green progress bar
                    borderRadius: '4px',
                    position: 'absolute',
                    top: 0,
                    padding: '0 10px' ,
                    left: 0,
                }}
            />
        </Slider>

        {/* Mute/Unmute Button */}
        <Button onClick={() => setMuted(!muted)} className='px-2'>
            {muted ? <SoundOffWhite /> : <SoundOnWhite />}
        </Button>

        {/* Volume Control */}
        <Slider
            direction={Direction.HORIZONTAL}
            value={volume}
            onChange={(v: number) => setVolume(v)}
            style={{
                width: '10%',
                height: '8px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '4px',
            }}
        >
            <div
                style={{
                    width: `${volume * 100}%`,
                    height: '100%',
                    background: '#ddd',
                    borderRadius: '4px',
                }}
            />
        </Slider>

        {/* Fullscreen Button */}
        <Button onClick={toggleFullscreen} className='px-2'>
            {isFullscreen ? <MinimizeWhite /> : <MaximizeWhite />}
        </Button>
    </div>
    </div>
    );
};

export default VideoPlayer;
