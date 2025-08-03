"use client";;
import React from "react";
import { BackgroundGradient } from "./BgGradient";
import { FaJs, FaReact } from "react-icons/fa";


export function BackgroundGradientDemo() {
  return (
    <div className=" w-[70%] ml-[10rem] my-[3rem]">
      <BackgroundGradient className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-white dark:bg-zinc-900" animate={"true"}>
        {/* <img
          src={`/jordans.webp`}
          alt="jordans"
          height="400"
          width="400"
          className="object-contain" /> */}
          <FaJs style={{color: "orange", }} />
          <span className="text-[#00ffee] inline p-1 font-bold text-end">Begginer</span>

        <h1 className="text-3xl font-bold text-neutral-300 dark:text-neutral-200">
          JS Fundamentals
        </h1>
        <p className="text-gray-600">Learn the basics  of JavaScript programming 
          with interactive exercises</p>
        <button
          className="rounded-full bg-gradient-to-r from-[#00ffee] to-purple-500 pl-4 pr-1 py-1 text-white flex items-center space-x-1 bg-black mt-4 text-xs font-bold dark:bg-zinc-800">
          <span className="px-5 text-xl py-3">Enroll now</span>
        </button>
      </BackgroundGradient>
    </div>
  );
}
