import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import homebgimage from "../assets/homebgimage.jpg";
import { FaCalendarAlt } from "react-icons/fa";

const HomePage = () => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      className="h-screen w-full bg-cover bg-center relative transition-opacity duration-500"
      style={{
        backgroundImage: `url(${homebgimage})`,
        opacity: imageLoaded ? 1 : 0, 
      }}
    >
      {/* Preload the image */}
      <img
        src={homebgimage}
        alt="Background"
        className="hidden"
        onLoad={() => setImageLoaded(true)}
      />

      {/* Overlay using absolute positioning */}
      {imageLoaded && (
        <div className="absolute inset-0 bg-black opacity-60 z-0"></div>
      )}

      {/* Centered content */}
      <div
        className={`relative z-10 flex flex-col items-center justify-center text-center space-y-6 px-4 h-full transition-all duration-700 ${
          imageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        }`}
      >
        <FaCalendarAlt className="text-white text-6xl md:text-8xl drop-shadow-lg animate-bounce" />
        <h1 className="text-3xl md:text-6xl font-extrabold text-white drop-shadow-lg">
          Step Into the Realm of Vpearl Venuta – Where Legendary Events Unfold
        </h1>

        <p className="text-base md:text-xl lg:text-2xl text-white max-w-2xl">
          Step into the shadows and book your next grand event at Vpearl Venuta. Discover spaces with power, mystery, and elegance, all tailored to your vision.
        </p>
        <button
          className="px-8 md:px-10 py-3 md:py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg md:text-xl font-semibold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transform transition duration-300"
          onClick={() => navigate("/login-options")}
        >
          Get Started
        </button>
      </div>

      {/* Footer */}
      {imageLoaded && (
        <div className="absolute bottom-0 w-full text-center py-4 bg-black bg-opacity-60 hidden md:flex justify-center items-center gap-4">
          <p className="text-white text-xs md:text-sm">
            © 2025 Vpearl Venuta. All rights reserved.
          </p>
          <a href="/privacy-policy" className="text-white text-xs md:text-sm hover:underline">
            Privacy Policy
          </a>
          <span className="text-white">|</span>
          <a href="/terms-and-conditions" className="text-white text-xs md:text-sm hover:underline">
            Terms & Conditions
          </a>
        </div>
      )}
    </div>
  );
};

export default HomePage;
