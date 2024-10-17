'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import UserMediaService from '../models/mediaModel';
import useIsMobile from './Mobile';

interface IProps {
  open: boolean;
  onClose: () => void;
  setIsBlur: React.Dispatch<React.SetStateAction<boolean>>;
  isBlur: boolean;
  audioPermisson: boolean;
  cameraPermisson: boolean;
}


interface CustomAuioElement extends HTMLAudioElement {
  captureStream: () => MediaStream;
}

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

const TestingSidebar: React.FC<IProps> = ({ open, onClose, setIsBlur, isBlur, audioPermisson, cameraPermisson }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const speakerRef = useRef<CustomAuioElement>(null);
  const videoCanvasRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const minOnRef = useRef<boolean | null>(false);
  const usermediaRef = useRef<UserMediaService | null>(null)

  const speakerScriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const speakerAnalyserRef = useRef<AnalyserNode | null>(null);
  const speakerMinOnRef = useRef<boolean | null>(false);


  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [outputDevices, setOutputDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedAudio, setSelectedAudio] = useState<string | null>(null);
  const [selectedOutput, setSelectedOutput] = useState<string | null>(null);
  const [videoStart, setVideoStart] = useState(false);
  const [audioStart, setAudioStart] = useState(false);
  const [speakerStart, setSpeakerStart] = useState(false);
  const [audioFhz, setAudioFhz] = useState(0);
  const [speakerFhz, setSpeakerFhz] = useState(0);
  const isModile = useIsMobile();

  const AudioProcess = useCallback(() => {

    if (!analyserRef.current || !minOnRef.current) {
      setAudioFhz(0);
      return
    }

    const array = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(array);
    const arraySum = array.reduce((a, value) => a + value, 0);
    const average = arraySum / array.length;
    const voiceVolume = Math.round(average);

    setAudioFhz(voiceVolume);

  }, [analyserRef.current, minOnRef.current])



  const SpeackerProcess = useCallback(() => {
    console.log('ssssss')
    if (!speakerAnalyserRef.current || !speakerMinOnRef.current) {
      setSpeakerFhz(0);
      return
    }

    const array = new Uint8Array(speakerAnalyserRef.current.frequencyBinCount);
    speakerAnalyserRef.current.getByteFrequencyData(array);
    const arraySum = array.reduce((a, value) => a + value, 0);
    const average = arraySum / array.length;
    const voiceVolume = Math.round(average);

    setSpeakerFhz(voiceVolume);

  }, [speakerAnalyserRef.current, speakerMinOnRef.current])





  const startAudioFhz = useCallback((stream: MediaStream) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaStreamSource(stream);



    const analyser = audioContext.createAnalyser();
    const scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);
    analyser.smoothingTimeConstant = 0.8;
    analyser.fftSize = 1024;
    analyserRef.current = analyser;
    scriptProcessorRef.current = scriptProcessor;

    source.connect(analyser);
    analyser.connect(scriptProcessor);
    scriptProcessor.connect(audioContext.destination);
    scriptProcessorRef.current.addEventListener('audioprocess', AudioProcess);

  }, [minOnRef.current]);



  const startSpeakerFhz = useCallback(async (stream: MediaStream) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaStreamSource(stream);
    await audioContext.resume();



    const analyser = audioContext.createAnalyser();
    const scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);
    analyser.smoothingTimeConstant = 0.8;
    analyser.fftSize = 1024;
    speakerAnalyserRef.current = analyser;
    speakerScriptProcessorRef.current = scriptProcessor;

    source.connect(analyser);
    analyser.connect(scriptProcessor);
    scriptProcessor.connect(audioContext.destination);
    console.log('aaya')
    speakerScriptProcessorRef.current.addEventListener('audioprocess', SpeackerProcess);

  }, [speakerMinOnRef.current]);

  // Get available devices (video, audio input, audio output)
  const getEnumerateDevice = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoInputDevices = devices.filter((device) => device.kind === 'videoinput');
      const audioInputDevices = devices.filter((device) => device.kind === 'audioinput');
      const audioOutputDevices = devices.filter((device) => device.kind === 'audiooutput');
      setVideoDevices(videoInputDevices);
      setAudioDevices(audioInputDevices);
      setOutputDevices(audioOutputDevices);
    } catch (error) {
      console.log('Error:', (error as Error).message);
      setVideoDevices([]);
      setAudioDevices([]);
      setOutputDevices([]);
    }
  }, []);



  useEffect(() => {
    getEnumerateDevice();
  }, [getEnumerateDevice, audioPermisson, cameraPermisson]);

  useEffect(() => {
    if (usermediaRef.current && usermediaRef.current.segmenter) {
      usermediaRef.current.blurBackground(usermediaRef.current.segmenter, isBlur ? 10 : 0);
    }
  }, [isBlur])

  // Play the selected video device
  const playVideo = async (deviceId: string) => {

    try {
      if (!videoStart) {
        usermediaRef.current = new UserMediaService(videoCanvasRef, canvasRef, isBlur);
        const videoTrack = await usermediaRef.current.getVideoTrack(deviceId);

        if (videoRef.current && videoTrack) {
          videoRef.current.srcObject = new MediaStream([videoTrack]);
          videoRef.current.play();
        }
        setVideoStart(true)
      } else {
        if (videoRef.current) {
          videoRef.current.srcObject = null;
          setVideoStart(false)
        }

      }


    } catch (error) {
      console.log('Video Error:', (error as Error).message);
    }
  };

  // Play the selected audio device
  const playAudio = async (deviceId: string) => {
    try {
      if (!audioStart) {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: { deviceId },
        });
        minOnRef.current = true;
        startAudioFhz(stream);

        if (audioRef.current) {
          audioRef.current.srcObject = stream;
          audioRef.current.play();
        }
        setAudioStart(true);
      } else {
        if (audioRef.current) {
          minOnRef.current = false;
          scriptProcessorRef.current?.removeEventListener('audioprocess', AudioProcess);
          audioRef.current.pause();
          setAudioStart(false);
        }
      }

    } catch (error) {
      console.log('Audio Error:', (error as Error).message);
    }
  };

  // Change the output device
  const changeOutputDevice = async (deviceId: string) => {
    if (speakerRef.current) {
      try {

        if (!speakerStart) {
          await speakerRef.current.setSinkId(deviceId);
          speakerRef.current.currentTime = 0;
          speakerRef.current.play();
          setSpeakerStart(true);
          const stream = speakerRef.current.captureStream();

          if (stream) {
            startSpeakerFhz(stream as MediaStream);
          }
          speakerMinOnRef.current = true;
        } else {
          speakerRef.current.pause();
          setSpeakerStart(false);
          speakerMinOnRef.current = false;
        }


      } catch (error) {
        console.log('Output Device Error:', (error as Error).message);
      }
    }
  };

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    }
  }, [open]);



  return (
    <div>
      <video ref={videoCanvasRef} style={{ display: "none" }}></video>
      <canvas ref={canvasRef} width={640} height={480} style={{ display: "none" }}></canvas>
      <h2 className="text-black text-[28px] font-bold mb-3">Einstellungen</h2>

      {/* Test your camera */}
      <div className="w-[20rem] relative mb-6">
        <h3 className="text-[16px] text-black mb-3 font-semibold">Test Ihrer Kamera</h3>

        <video ref={videoRef} className="w-full h-[12rem] bg-black rounded-md mb-3"></video>
        <div className="flex items-center mb-2">
          <button
            onClick={() => playVideo(selectedVideo || videoDevices[0]?.deviceId)}
            className="py-2 px-4 bg-gray-200 text-black font-medium text-[16px] rounded "
          >
            {videoStart ? 'Stop' : 'Start'}
          </button>
          <select
            className="ml-2 px-2 py-2 rounded text-sm w-full border outline-blue-500"
            value={selectedVideo || ''}
            onChange={(e) => setSelectedVideo(e.target.value)}
          >
            <option value="" disabled>
              Camera Aukey
            </option>
            {videoDevices.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Camera ${device.deviceId}`}
              </option>
            ))}
          </select>
        </div>
      </div>


      

      {/* Test audio output */}
      <div className="w-[20rem] relative mb-6">
        <h3 className="text-[16px] text-black mb-3 font-semibold">Test Ihrer Lautsprecher</h3>
        <div className="flex items-center mb-2">
          <button
            onClick={() => {
              changeOutputDevice(selectedOutput || outputDevices[0]?.deviceId);
            }}
            className="py-2 px-4 bg-gray-200 text-black font-medium text-[16px] rounded"
          >
            {speakerStart ? 'Stop' : 'Start'}
          </button>
          <select
            className="ml-2 px-2 py-2 rounded text-sm w-full border outline-blue-500"
            value={selectedOutput || ''}
            onChange={(e) => setSelectedOutput(e.target.value)}
          >
            <option value="" disabled>
              Headset Earphone
            </option>
            {outputDevices.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Output ${device.deviceId}`}
              </option>
            ))}
          </select>
        </div>
        <audio ref={speakerRef} src='/welcome.mp3' controls className="w-full hidden"></audio>
        <div className="flex items-center">
          <p className="text-[16px] text-gray-400">Lautstärke</p>
          <div className={`w-full bg-gray-200 h-[5px] rounded-md ml-2 relative overflow-hidden`}>
            <div className={`bg-[#2B86FC] h-full`} style={{ width: `${speakerFhz}%` }}></div>
          </div>

        </div>

      </div>



      {/* Test your microphone */}
      <div className="w-[20rem] relative mb-6">
        <h3 className="text-[16px] text-black mb-3 font-semibold">Test Ihres Mikrofons</h3>
        <div className="flex items-center mb-2">
          <button
            onClick={() => playAudio(selectedAudio || audioDevices[0]?.deviceId)}
            className="py-2 px-4 bg-gray-200 text-black font-medium text-[16px] rounded"
          >
            {audioStart ? 'Stop' : 'Start'}
          </button>
          <select
            className="ml-2 px-2 py-2 rounded text-sm w-full border outline-blue-500"
            value={selectedAudio || ''}
            onChange={(e) => setSelectedAudio(e.target.value)}
          >
            <option value="" disabled>
              Microphone Aukey
            </option>
            {audioDevices.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Microphone ${device.deviceId}`}
              </option>
            ))}
          </select>
        </div>
        <audio ref={audioRef} controls className="w-full hidden"></audio>
        <div className="flex items-center">
          <p className="text-[16px] text-gray-400">Lautstärke</p>
          <div className={`w-full bg-gray-200 h-[5px] rounded-md ml-2 relative overflow-hidden`}>
            <div className={`bg-[#2B86FC] h-full`} style={{ width: `${audioFhz}%` }}></div>
          </div>
          {/* <input type="range" className="ml-2 w-full remove-dot" min={0} max={100} step={1} onChange={handleVolume} value={audioFhz} /> */}
        </div>
      </div>

      {/* Additional options */}
      <div className="w-[20rem] mb-5">
        <h3 className="text-[16px] text-black mb-2 font-semibold">Test Ihrer Lautsprecher</h3>
        <label className="flex items-center space-x-2 checkbox" htmlFor='checkbox'>

          <input type="checkbox" id='checkbox' className="form-checkbox accent-blue-500 w-4 h-4 border-none bg-gray-500  hidden" checked={isBlur} onChange={() => setIsBlur(prev => !prev)} />
          <span className="checkmark relative"></span>
          <span className="text-gray-400 text-[16px]">Hintergrund weichzeichnen</span>
        </label>
      </div>
    </div>
  );
};

export default TestingSidebar;
