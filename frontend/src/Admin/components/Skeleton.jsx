import React from "react";
import clsx from "clsx";



const Skeleton= ({
  width = "w-full",
  height = "h-4",
  rounded = "rounded",
  className = "",
}) => (
  <div
    className={clsx(
      "animate-pulse bg-gray-200",
      width,
      height,
      rounded,
      className
    )}
  />
);

export default Skeleton; 