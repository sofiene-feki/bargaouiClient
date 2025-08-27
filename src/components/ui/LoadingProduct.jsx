import React from "react";

export default function LoadingProduct({ length, cols }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-${cols} gap-4`}>
      {Array.from({ length: length }).map((_, idx) => (
        <div
          key={idx}
          className="border mx-2 border-gray-200 rounded-md cursor-pointer animate-pulse"
        >
          <div className="aspect-square  w-full rounded-t-md bg-gray-200" />
          <div className="p-2 bg-white">
            <div className="mt-2 flex justify-between">
              <div className="h-5 w-3/4 bg-gray-300 rounded"></div>
              <div className="h-5 w-1/4 bg-gray-300 rounded"></div>
            </div>
            <div className="mt-4 h-10 w-full bg-gray-300 rounded-lg "></div>
          </div>
        </div>
      ))}
    </div>
  );
}
