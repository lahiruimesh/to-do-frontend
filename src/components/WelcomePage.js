import React, { useState, useEffect } from 'react';
import { FiZap, FiCheck, FiStar, FiArrowRight, FiCalendar } from 'react-icons/fi';

const WelcomePage = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const welcomeSteps = [
    "Welcome to TodoMaster",
    "Your productivity companion",
    "Ready to get organized?"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 2; // 2% every 100ms = 5 seconds total
        
        // Update step text
        if (newProgress <= 30) setCurrentStep(0);
        else if (newProgress <= 70) setCurrentStep(1);
        else setCurrentStep(2);

        if (newProgress >= 100) {
          clearInterval(timer);
          setTimeout(() => onComplete(), 500); // Small delay for smooth transition
          return 100;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* App Icon */}
        <div className="mb-8 relative">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl shadow-2xl shadow-blue-500/25 transform rotate-3 hover:rotate-0 transition-transform duration-500">
            <FiZap className="text-3xl text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg">
            <FiStar className="text-sm text-white" />
          </div>
        </div>

        {/* App Title */}
        <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6 animate-pulse">
          TodoMaster
        </h1>

        {/* Dynamic welcome message */}
        <div className="mb-8 h-16 flex items-center justify-center">
          <p className="text-2xl text-gray-700 font-medium transition-all duration-500 ease-in-out transform">
            {welcomeSteps[currentStep]}
          </p>
        </div>

        {/* App description */}
        <div className="mb-10 space-y-4">
          <p className="text-lg text-gray-600 leading-relaxed">
            Streamline your productivity with our intuitive task management system
          </p>
          
          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            <div className="flex flex-col items-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50 shadow-lg">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-3 shadow-lg">
                <FiCheck className="text-white text-xl" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Simple Tasks</h3>
              <p className="text-sm text-gray-600 text-center">Easy to create and manage</p>
            </div>

            <div className="flex flex-col items-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50 shadow-lg">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mb-3 shadow-lg">
                <FiCalendar className="text-white text-xl" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Stay Organized</h3>
              <p className="text-sm text-gray-600 text-center">Track your progress</p>
            </div>

            <div className="flex flex-col items-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50 shadow-lg">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-3 shadow-lg">
                <FiZap className="text-white text-xl" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Boost Productivity</h3>
              <p className="text-sm text-gray-600 text-center">Get things done faster</p>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">Loading your workspace</span>
            <span className="text-sm font-medium text-blue-600">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-white/60 rounded-full h-3 backdrop-blur-sm border border-white/50 shadow-inner overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-full transition-all duration-100 ease-out shadow-lg"
              style={{ width: `${progress}%` }}
            >
              <div className="h-full bg-gradient-to-r from-white/30 to-transparent rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Skip button */}
        <button
          onClick={onComplete}
          className="group inline-flex items-center gap-2 px-6 py-3 bg-white/80 hover:bg-white text-gray-700 hover:text-gray-900 font-medium rounded-xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-200 backdrop-blur-sm"
        >
          Skip to Dashboard
          <FiArrowRight className="text-sm group-hover:translate-x-1 transition-transform duration-200" />
        </button>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Made with ❤️ for better productivity
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;