"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useWavesurfer = (containerRef: any, options: any) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [wavesurfer, setWavesurfer] = useState<any>(null);

  // Initialize wavesurfer when the container mounts
  // or any of the props change
  useEffect(() => {
    if (!containerRef.current) return;

    const ws = WaveSurfer.create({
      ...options,
      container: containerRef.current,
    });

    setWavesurfer(ws);

    return () => {
      ws.destroy();
    };
  }, [options, containerRef]);

  return wavesurfer;
};

const WaveTrack = () => {
  const waveRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const audioUrl = searchParams.get("audio");

  const optionMemo = useMemo(() => {
    return {
      container: waveRef.current!,
    waveColor: "rgb(200, 0, 200)",
    progressColor: "rgb(100, 0, 100)",
    url: `/api?audio=${audioUrl}`,
    }
  }, [audioUrl])

  const wavesurfer = useWavesurfer(waveRef, optionMemo)

  // const audioUrl = searchParams.get("audio");
  // useEffect(() => {
  //   WaveSurfer.create({
  //     container: waveRef.current!,
  //     waveColor: "rgb(200, 0, 200)",
  //     progressColor: "rgb(100, 0, 100)",
  //     url: `/api?audio=${audioUrl}`,
  //   });
  // return () => {
  //   WaveSurfer.destroy();
  // };
  // }, [audioUrl]);

  return <div ref={waveRef}>WaveTrack</div>;
};

export default WaveTrack;
