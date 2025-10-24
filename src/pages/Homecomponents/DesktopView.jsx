// components/DesktopView.js
import React from "react";
import { FaCalendarAlt, FaArrowRight, FaHeadset,FaUserAlt,FaUserShield  } from "react-icons/fa";
import FeatureItem from "./FeatureItem";
import LoginCard from "./LoginCard";

const DesktopView = ({ showLoginOptions, setShowLoginOptions, handleGetStarted, handleLoginClick }) => {
  return (
    <div className="hidden lg:flex flex-col justify-center items-center min-h-screen relative z-10">
      <div className="flex w-full max-w-7xl justify-between items-center px-8 lg:px-12 py-10 relative">
        
        {/* LEFT SECTION - Fixed Content */}
        <div className="flex-1 max-w-2xl">
          <div className="space-y-8 animate-fadeIn">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-lg rounded-3xl border border-white/30 shadow-2xl hover:scale-105 transition-transform duration-300">
                <span className="text-3xl font-bold bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">VV</span>
              </div>
              <div>
                <h1 className="text-6xl lg:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  Venuta
                </h1>
                <p className="text-2xl font-light text-white/90 mt-2">
                  Enterprise Event Management Platform
                </p>
              </div>
            </div>

            {/* Description */}
            <p className="text-xl text-white/80 leading-relaxed max-w-2xl">
              Step into the realm of Vpearl Venuta – where legendary events unfold. 
              Discover spaces with power, mystery, and elegance.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
              {["Legendary Venues", "Tailored Experiences", "Premium Service", "24/7 Support"].map((item, index) => (
                <FeatureItem key={item} text={item} delay={index * 100} />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SECTION - Dynamic Content */}
        <div className="flex-1 max-w-md relative">
          {/* Welcome Card */}
          {!showLoginOptions && (
            <WelcomeCard 
              handleGetStarted={handleGetStarted} 
              setShowLoginOptions={setShowLoginOptions} 
            />
          )}

          {/* Login Options */}
          <LoginOptions 
            showLoginOptions={showLoginOptions} 
            handleLoginClick={handleLoginClick}
            setShowLoginOptions={setShowLoginOptions}
          />
        </div>
      </div>
    </div>
  );
};

// Sub-components for DesktopView
const WelcomeCard = ({ handleGetStarted }) => (
  <div className="animate-fadeIn">
    <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 lg:p-12 border border-white/20 hover:scale-[1.02] transition-transform duration-500">
      <div className="flex flex-col items-center space-y-6">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-300">
          <FaCalendarAlt className="text-3xl text-white" />
        </div>
        <div className="text-center ">
          <h2 className="text-3xl  text-red  font-bold">
          
            <span className="bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
               Welcome to{" "}
            </span>
            <span className="bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
              Venuta
            </span>
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            Step Into the Realm of Vpearl Venuta – Where Legendary Events Unfold
          </p>
        </div>
      </div>

      <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-100 mt-8 text-center text-gray-700 backdrop-blur-sm">
        Step into the shadows and book your next grand event at Vpearl Venuta.
      </div>

      <button
        onClick={handleGetStarted}
        className="cursor-pointer group mt-8 w-full p-5 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 border border-purple-600 shadow-xl hover:shadow-2xl transition-all duration-500 flex items-center justify-between text-white hover:scale-[1.02] active:scale-[0.98]"
      >
        <div className="flex flex-col text-left">
          <span className="font-semibold text-lg">Get Started</span>
          <span className="text-sm text-purple-100">Begin your event journey</span>
        </div>
        <FaArrowRight className="group-hover:translate-x-2 transition-transform duration-300 text-lg" />
      </button>

      <FooterLinks />
    </div>
  </div>
);

const LoginOptions = ({ showLoginOptions, handleLoginClick, setShowLoginOptions }) => (
  <div 
    className={`login-options-container transition-all duration-700 ease-in-out ${
      showLoginOptions 
        ? 'translate-x-0 opacity-100 scale-100' 
        : 'translate-x-32 opacity-0 scale-95 pointer-events-none absolute right-0'
    }`}
  >
    {showLoginOptions && (
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 lg:p-12 border border-white/20 animate-slideInRight">
        <LoginHeader />
        
        <div className="space-y-6">
          <LoginCard
            title="User Login"
            description="Access your personal account"
            icon={FaUserAlt}
            path="/user-login"
            color={{
              from: "from-purple-50 to-white",
              to: "hover:from-purple-100 hover:to-white",
              border: "border-purple-100 hover:border-purple-300",
              iconBg: "bg-purple-100 group-hover:bg-purple-200",
              icon: "text-purple-600",
              arrow: "text-purple-500"
            }}
            delay={100}
            onClick={handleLoginClick}
          />

          <LoginCard
            title="Admin Login"
            description="Manage system administration"
            icon={FaUserShield}
            path="/admin-login"
            color={{
              from: "from-purple-100 to-white",
              to: "hover:from-purple-200 hover:to-white",
              border: "border-purple-200 hover:border-purple-400",
              iconBg: "bg-purple-200 group-hover:bg-purple-300",
              icon: "text-purple-700",
              arrow: "text-purple-700"
            }}
            delay={200}
            onClick={handleLoginClick}
          />
        </div>

        <SupportSection />
        
        <BackButton setShowLoginOptions={setShowLoginOptions} />
      </div>
    )}
  </div>
);

const LoginHeader = () => (
  <div className="space-y-6 mb-8 text-center">
    <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl shadow-lg mx-auto hover:scale-105 transition-transform duration-300">
      <span className="text-2xl font-bold text-white">VV</span>
    </div>
    <div>
      <h2 className="text-2xl font-bold text-gray-800">
        Choose Your Access
      </h2>
      <p className="text-sm text-gray-600 mt-2">
        Select your login type to access your personalized dashboard
      </p>
    </div>
  </div>
);

const SupportSection = () => (
  <div className="pt-6 border-t border-gray-200/50 mt-8">
    <div className="inline-flex items-center space-x-3 text-gray-500 hover:text-purple-700 transition-all duration-300 cursor-pointer group p-2 rounded-lg hover:bg-purple-50">
      <div className="flex items-center justify-center w-8 h-8 bg-gray-100 group-hover:bg-purple-100 rounded-lg transition-colors duration-300">
        <FaHeadset className="text-sm group-hover:scale-110 transition-transform duration-300" />
      </div>
      <span className="text-sm font-medium">Need assistance? Contact Support</span>
    </div>
  </div>
);

const BackButton = ({ setShowLoginOptions }) => (
  <button
    onClick={() => setShowLoginOptions(false)}
    className=" cursor-pointer group mt-6 w-full p-4 rounded-xl bg-gray-100 hover:bg-gray-200 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 text-gray-700 text-sm font-medium flex items-center justify-center space-x-2 hover:scale-[1.02] active:scale-[0.98]"
  >
    <span className="group-hover:-translate-x-1 transition-transform duration-300">←</span>
    <span>Back to Home</span>
  </button>
);

const FooterLinks = () => (
  <div className="mt-8 text-center border-t border-gray-200/50 pt-6">
    <div className="flex justify-center space-x-4 text-xs text-gray-500">
      <a href="/privacy-policy" className="hover:text-purple-700 transition-colors duration-300 hover:underline">
        Privacy Policy
      </a>
      <span>|</span>
      <a href="/terms-and-conditions" className="hover:text-purple-700 transition-colors duration-300 hover:underline">
        Terms & Conditions
      </a>
    </div>
    <p className="text-xs text-gray-500 mt-3">
      © 2025 Vpearl Venuta. All rights reserved.
    </p>
  </div>
);

export default DesktopView;