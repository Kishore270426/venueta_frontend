// components/LoginCard.js
import React from "react";
import { FaArrowRight } from "react-icons/fa";

const LoginCard = ({ title, description, icon: Icon, path, color, delay, onClick }) => (
  <div 
    onClick={() => onClick(path)}
    className={`group p-6 bg-gradient-to-br ${color.from} ${color.to} border ${color.border} rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-[1.03] active:scale-[0.98] transition-all duration-500 cursor-pointer backdrop-blur-sm animate-slideUp`}
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className={`flex items-center justify-center w-12 h-12 ${color.iconBg} group-hover:scale-110 rounded-xl transition-all duration-300 shadow-lg`}>
          <Icon className={`text-xl ${color.icon}`} />
        </div>
        <div className="text-left">
          <h3 className="font-semibold text-gray-800 text-lg">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      <FaArrowRight className={`${color.arrow} group-hover:translate-x-2 transition-transform duration-300 text-lg`} />
    </div>
  </div>
);

export default LoginCard;