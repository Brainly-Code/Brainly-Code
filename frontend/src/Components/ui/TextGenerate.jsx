"use client";
import { useEffect } from "react";
import { motion, stagger, useAnimate } from "motion/react";
import { cn } from "@/lib/utils";

const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.5,
}) => {
  const [scope, animate] = useAnimate();
  const wordsArray = words.split(" ");

  useEffect(() => {
    animate(
      "span",
      {
        opacity: 1,
        filter: filter ? "blur(0px)" : "none",
      },
      {
        duration: duration,
        delay: stagger(0.2),
      }
    );
  }, [animate, filter, duration]);

  return (
    <div
      className={cn(
        "block w-full max-w-2xl mx-auto p-6 bg-[#09002C] text-[#F6F7F9] text-base font-mono leading-relaxed tracking-wide whitespace-pre-wrap",
        className
      )}
    >
      <motion.div ref={scope} className="inline">
        {wordsArray.map((word, idx) => (
        <motion.span
          key={word + idx}
          className="inline opacity-0"
          style={{
            filter: filter ? "blur(10px)" : "none",
            marginRight: "0.25em", // adds space after each word
          }}
        >
          {word}
        </motion.span>
        ))}
      </motion.div>
    </div>
  );
};

export default TextGenerateEffect;
