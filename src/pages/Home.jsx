// HomePage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BackgroundElements from "./Homecomponents/BackgroundElements";
import DesktopView from "./Homecomponents/DesktopView";
import MobileView from "./Homecomponents/MobileView";

const HomePage = () => {
  const navigate = useNavigate();
  const [showLoginOptions, setShowLoginOptions] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleGetStarted = () => {
    setShowLoginOptions(true);
  };

  const handleLoginClick = (path) => {
    const element = document.querySelector('.login-options-container');
    if (element) {
      element.style.transform = 'translateX(100px)';
      element.style.opacity = '0';
    }
    setTimeout(() => navigate(path), 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-purple-400 to-purple-500 text-white overflow-hidden relative">
      <BackgroundElements />
      
      <DesktopView
        showLoginOptions={showLoginOptions}
        setShowLoginOptions={setShowLoginOptions}
        handleGetStarted={handleGetStarted}
        handleLoginClick={handleLoginClick}
      />

      <MobileView
        showLoginOptions={showLoginOptions}
        setShowLoginOptions={setShowLoginOptions}
        handleGetStarted={handleGetStarted}
        handleLoginClick={handleLoginClick}
      />

      <CustomStyles />
    </div>
  );
};

// Custom Styles Component
const CustomStyles = () => (
  <style jsx>{`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideInRight {
      from { opacity: 0; transform: translateX(50px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
    }
    @keyframes float-delayed {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-15px) rotate(5deg); }
    }
    @keyframes float-slow {
      0%, 100% { transform: translateY(0px) scale(1); }
      50% { transform: translateY(-10px) scale(1.05); }
    }
    @keyframes pulse-slow {
      0%, 100% { opacity: 0.1; }
      50% { opacity: 0.2; }
    }
    @keyframes pulse-slower {
      0%, 100% { opacity: 0.05; }
      50% { opacity: 0.15; }
    }
    @keyframes pulse-delayed {
      0%, 100% { opacity: 0.08; }
      50% { opacity: 0.12; }
    }
    .animate-fadeIn {
      animation: fadeIn 0.8s ease-out forwards;
    }
    .animate-slideUp {
      animation: slideUp 0.6s ease-out forwards;
    }
    .animate-slideInRight {
      animation: slideInRight 0.7s ease-out forwards;
    }
    .animate-float {
      animation: float 6s ease-in-out infinite;
    }
    .animate-float-delayed {
      animation: float-delayed 8s ease-in-out infinite;
    }
    .animate-float-slow {
      animation: float-slow 10s ease-in-out infinite;
    }
    .animate-pulse-slow {
      animation: pulse-slow 8s ease-in-out infinite;
    }
    .animate-pulse-slower {
      animation: pulse-slower 12s ease-in-out infinite;
    }
    .animate-pulse-delayed {
      animation: pulse-delayed 10s ease-in-out infinite;
    }
  `}</style>
);

export default HomePage;