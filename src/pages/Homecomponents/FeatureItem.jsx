// components/FeatureItem.js
import React from "react";

const FeatureItem = ({ text, delay }) => (
  <div 
    className="flex items-center space-x-3 animate-fadeIn"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="w-2 h-2 bg-white rounded-full flex-shrink-0" />
    <span className="text-white/90">{text}</span>
  </div>
);

export default FeatureItem;