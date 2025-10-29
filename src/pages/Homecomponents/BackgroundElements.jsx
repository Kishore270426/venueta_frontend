// components/BackgroundElements.js
import React from "react";
import { FaStar, FaGem } from "react-icons/fa";

const BackgroundElements = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl animate-pulse-slower"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-300/5 rounded-full blur-3xl animate-pulse-delayed"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 animate-float">
        <FaStar className="text-purple-300/30 text-xl" />
      </div>
      <div className="absolute top-40 right-20 animate-float-delayed">
        <FaGem className="text-purple-200/40 text-lg" />
      </div>
      <div className="absolute bottom-32 left-20 animate-float-slow">
        <FaStar className="text-purple-300/20 text-lg" />
      </div>
    </div>
  );
};

export default BackgroundElements;