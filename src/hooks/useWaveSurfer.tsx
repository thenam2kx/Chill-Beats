"use client";
import { useEffect, useState } from "react";
import WaveSurfer, { WaveSurferOptions } from "wavesurfer.js";


const useWaveSurfer = (
  containerRef: React.RefObject<HTMLDivElement | null>,
  options: Omit<WaveSurferOptions, 'container'>
) => {
  const [waveSurfer, setWaveSurfer] = useState<WaveSurfer | null>(null);

  // Initialize wavesurfer when the container mounts
  // or any of the props change
  useEffect(() => {
    if (!containerRef.current) return;

    const ws = WaveSurfer.create({
      ...options,
      container: containerRef.current,
    });

    setWaveSurfer(ws);

    return () => {
      ws.destroy();
    };
  }, [options, containerRef]);

  return waveSurfer;
};
export default useWaveSurfer;