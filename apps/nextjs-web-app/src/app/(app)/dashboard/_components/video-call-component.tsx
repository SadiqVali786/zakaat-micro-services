/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { ImPhoneHangUp } from "react-icons/im";
import ZakaatLogo from "@/../public/logo/logo.png";
import Image from "next/image";
import { BsMicMuteFill } from "react-icons/bs";
import { HiSpeakerWave } from "react-icons/hi2";
import { FaCamera } from "react-icons/fa";
import { useState, useEffect } from "react";

export const VideoCallComponent = ({ image, name }: { image: string; name: string }) => {
  const Name = "Sadiq Vali";

  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);
  const [isCamera, setIsCamera] = useState(false);

  const handleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleSpeaker = () => {
    setIsSpeaker(!isSpeaker);
  };

  const handleCamera = () => {
    setIsCamera(!isCamera);
  };

  const handleHangUp = () => {
    setIsMuted(false);
    setIsSpeaker(false);
    setIsCamera(false);
  };

  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(seconds + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds]);

  useEffect(() => {
    if (seconds === 60) {
      setMinutes(minutes + 1);
      setSeconds(0);
    }
  }, [seconds]);

  return (
    <div className="flex h-full items-center justify-center">
      <div className="border-neutral-11 h-fit w-fit rounded-4xl border p-8 shadow-[0px_10px_20px_-8px_#8e8c95]">
        <div className="flex flex-col gap-y-20">
          <div className="flex flex-col items-start justify-start gap-y-4 self-start">
            <div className="flex items-center justify-center gap-x-4">
              <Image
                src={ZakaatLogo}
                alt="zakaat logo"
                width={30}
                height={30}
                className="grayscale-50"
              />
              <h1 className="text-2xl font-bold text-blue-100">P2P VIDEO CALL</h1>
            </div>
            <p className="text-3xl font-bold text-blue-100">{Name}</p>
            <p className="text-2xl font-bold text-blue-100">
              {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
            </p>
          </div>
          <div className="flex flex-col items-center justify-center gap-y-4">
            <Image
              src={`https://ui-avatars.com/api/?name=${Name}`}
              alt="applicant image"
              className="rounded-full"
              width={150}
              height={150}
            />
          </div>
          <div className="flex items-center justify-center gap-x-8">
            <div className="group flex cursor-pointer flex-col items-center justify-center gap-y-2">
              <button className="cursor-pointer rounded-full border-2 border-blue-50 p-4 text-blue-50 hover:border-blue-600 hover:bg-blue-600 hover:text-purple-600">
                <BsMicMuteFill className="h-10 w-10" />
              </button>
              <p className="text-neutral-7 group-hover:text-blue-50">Mute</p>
            </div>
            <div className="group flex cursor-pointer flex-col items-center justify-center gap-y-2">
              <button className="cursor-pointer rounded-full border-2 border-blue-50 p-4 text-blue-50 hover:border-blue-600 hover:bg-blue-600 hover:text-purple-600">
                <HiSpeakerWave className="h-10 w-10" />
              </button>
              <p className="text-neutral-7 group-hover:text-blue-50">Speaker</p>
            </div>
            <div className="group flex cursor-pointer flex-col items-center justify-center gap-y-2">
              <button className="cursor-pointer rounded-full border-2 border-blue-50 p-4 text-blue-50 hover:border-blue-600 hover:bg-blue-600 hover:text-purple-600">
                <FaCamera className="h-10 w-10" />
              </button>
              <p className="text-neutral-7 group-hover:text-blue-50">Camera</p>
            </div>
          </div>
          <button className="cursor-pointer self-center rounded-full bg-red-500 p-4 text-white hover:bg-red-600 hover:text-blue-600">
            <ImPhoneHangUp className="h-10 w-10" />
          </button>
        </div>
      </div>
    </div>
  );
};
