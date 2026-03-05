"use client";

import { useState } from "react";
import { IoCopyOutline } from "react-icons/io5";

import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("react-lottie"), { ssr: false });

import { cn } from "@/lib/utils";

import { BackgroundGradientAnimation } from "./GradientBg";
import GridGlobe from "./GridGlobe";
import animationData from "@/data/confetti.json";
import MagicButton from "../MagicButton";
import { TextGenerateEffect } from "./TextGenerateEffect";
import GitHubCalendarCard from "./GitHubCalendarCard";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  id,
  title,
  description,
  img,
  imgClassName,
  titleClassName,
  spareImg,
}: {
  className?: string;
  id: number;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  img?: string;
  imgClassName?: string;
  titleClassName?: string;
  spareImg?: string;
}) => {
  const [copied, setCopied] = useState(false);

  const defaultOptions = {
    loop: copied,
    autoplay: copied,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const handleCopy = () => {
    const text = "hsu@jsmastery.pro";
    navigator.clipboard.writeText(text);
    setCopied(true);
  };

  return (
    <div
      className={cn(
        "row-span-1 relative overflow-hidden rounded-3xl border border-white/[0.1] group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none justify-between flex flex-col space-y-4",
        className
      )}
      style={{
        background: "rgb(15,15,15)",
        backgroundColor:
          "linear-gradient(90deg, rgba(15,15,15,1) 0%, rgba(30,30,30,1) 100%)",
      }}
    >
      {/* Card 5: GitHub Contributions (full-width) */}
      {id === 5 ? (
        <div className="h-full min-h-[240px] py-2">
          <GitHubCalendarCard />
        </div>
      ) : (
        <>
          {/* Standard card layout */}
          <div className={`${id === 7 && "flex justify-center"} h-full`}>
            <div className="w-full h-full absolute">
              {img && (
                <img
                  src={img}
                  alt={img}
                  className={cn(imgClassName, "object-cover object-center ")}
                />
              )}
            </div>
            <div
              className={`absolute right-0 -bottom-5 ${
                id === 6 && "w-full opacity-80"
              } `}
            >
              {spareImg && (
                <img
                  src={spareImg}
                  alt={spareImg}
                  className="object-cover object-center w-full h-full"
                />
              )}
            </div>
            {id === 7 && (
              <BackgroundGradientAnimation>
                <div className="absolute z-50 inset-0 flex items-center justify-center text-white font-bold px-4 pointer-events-none text-3xl text-center md:text-4xl lg:text-7xl"></div>
              </BackgroundGradientAnimation>
            )}

            <div
              className={cn(
                titleClassName,
                "group-hover/bento:translate-x-2 transition duration-200 relative md:h-full min-h-40 flex flex-col px-5 p-5 lg:p-10"
              )}
            >
              {/* Description */}
              <div className="font-sans font-extralight md:max-w-32 md:text-xs lg:text-base text-sm text-[#C1C2D3] z-10">
                {id === 1 && description ? (
                  <TextGenerateEffect
                    words={description as string}
                    className="text-sm lg:text-base font-extralight"
                  />
                ) : (
                  description
                )}
              </div>
              {/* Title */}
              <div
                className={`font-sans text-lg lg:text-3xl max-w-96 font-bold z-10 text-white`}
              >
                {title}
              </div>

              {/* Globe for timezone (Card 3) */}
              {id === 3 && <GridGlobe />}

              {/* CTA Purple (Card 7) */}
              {id === 7 && (
                <div className="mt-5 relative">
                  <div
                    className={`absolute -bottom-5 right-0 ${
                      copied ? "block" : "block"
                    }`}
                  >
                    <Lottie
                      options={defaultOptions}
                      height={200}
                      width={400}
                      eventListeners={[]}
                    />
                  </div>

                  <MagicButton
                    title={
                      copied ? "Email is Copied!" : "Copy my email address"
                    }
                    icon={<IoCopyOutline />}
                    position="left"
                    handleClick={handleCopy}
                    otherClasses="!bg-[#111111]"
                  />
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
