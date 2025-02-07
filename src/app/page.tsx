import React from "react";
import ItemShowComponent from "../components/item/ISC";

export default function Home() {
  return (
    <div className="flex flex-1 flex-wrap mx-0 min-[1046px]:mx-10 mt-20 text-black">
      <div className="w-full min-[1046px]:w-[60%] p-4">
        <div className="bg-gray-500 bg-opacity-60 rounded-md p-44">
          <h1>A</h1>
        </div>
      </div>

      <div className="w-full min-[1046px]:w-[40%] p-4">
        <div className="bg-gray-500 bg-opacity-60 rounded-md p-44">
          <h1>B</h1>
        </div>
      </div>

      <div className="w-full p-4">
        <div className="bg-gray-500 bg-opacity-60 rounded-md">
          <ItemShowComponent />
        </div>
      </div>
    </div>
  );
}
