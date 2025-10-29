// components/MobileView.js
import React from "react";
import { FaCalendarAlt, FaArrowRight, FaUserAlt, FaUserShield } from "react-icons/fa";
import LoginCard from "./LoginCard";

const MobileView = ({ showLoginOptions, setShowLoginOptions, handleGetStarted, handleLoginClick }) => {
  return (
    <div className="lg:hidden flex flex-col justify-center items-center min-h-screen p-4 relative z-10">
      <div className="w-full max-w-sm bg-white/95 backdrop-blur-xl text-gray-800 rounded-3xl shadow-2xl p-6 border border-white/20">
        {showLoginOptions ? (
          <MobileLoginOptions 
            setShowLoginOptions={setShowLoginOptions}
            handleLoginClick={handleLoginClick}
          />
        ) : (
          <MobileHomeContent 
            handleGetStarted={handleGetStarted}
          />
        )}
      </div>
    </div>
  );
};

const MobileLoginOptions = ({ setShowLoginOptions, handleLoginClick }) => (
  <div className="space-y-6 animate-fadeIn">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg">
        <span className="text-xl font-bold text-white">VV</span>
      </div>
      <h2 className="text-2xl font-bold text-center text-gray-800">
        Choose Your Access
      </h2>
      <p className="text-sm text-gray-600 text-center">
        Select your login type
      </p>
    </div>

    <div className="space-y-4">
      <LoginCard
        title="User Login"
        description="Personal account"
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
        description="System administration"
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
        delay={150}
        onClick={handleLoginClick}
      />
    </div>

    <button
      onClick={() => setShowLoginOptions(false)}
      className="w-full p-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium mt-4 transition-all duration-300 active:scale-[0.98]"
    >
      ← Back to Home
    </button>
  </div>
);

const MobileHomeContent = ({ handleGetStarted }) => (
  <div className="space-y-6 animate-fadeIn">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg">
        <FaCalendarAlt className="text-2xl text-white" />
      </div>
      <div className="text-center">
        <h2 className="text-2xl font-bold">
          Welcome to{" "}
          <span className="bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
            Venuta
          </span>
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Where Legendary Events Unfold
        </p>
      </div>
    </div>

    <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-100 text-center text-gray-700 text-sm">
      Book your next grand event with elegance and power.
    </div>

    {/* Mobile Features */}
    <div className="grid grid-cols-2 gap-3 text-sm">
      {["Legendary Venues", "Tailored Experiences", "Premium Service", "24/7 Support"].map((item) => (
        <div key={item} className="flex items-center space-x-2 text-gray-700">
          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full flex-shrink-0"></div>
          <span className="text-xs">{item}</span>
        </div>
      ))}
    </div>

    <button
      onClick={handleGetStarted}
      className="w-full bg-gradient-to-br from-purple-500 to-purple-700 border border-purple-600 rounded-2xl shadow-lg active:scale-[0.98] transition-all duration-300 text-white p-4 flex justify-between items-center"
    >
      <div className="text-left cursor-pointer">
        <h3 className="font-semibold text-lg ">Get Started</h3>
        <p className="text-sm text-purple-100">Begin your event journey</p>
      </div>
      <FaArrowRight className="text-lg transform group-hover:translate-x-1 transition-transform" />
    </button>

    <div className="text-center border-t border-gray-200/50 pt-4">
      <div className="flex justify-center space-x-3 text-xs text-gray-500">
        <a href="/privacy-policy" className="hover:text-purple-700 transition-colors">Privacy</a>
        <span>|</span>
        <a href="/terms-and-conditions" className="hover:text-purple-700 transition-colors">Terms</a>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        © 2025 Vpearl Venuta
      </p>
    </div>
  </div>
);

export default MobileView;