
import React from 'react';
import { IconBrandYoutube, IconSparkles, IconBolt, IconArrowRight } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-red-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          {/* Logo/Icon */}
          <div className="flex justify-center mb-8">
            <div className="p-6 rounded-full bg-gradient-to-br from-pink-500 to-red-500 shadow-lg">
              <IconBrandYoutube className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-br from-pink-500 to-red-500 bg-clip-text text-transparent leading-tight">
            YouTube Summarizer
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 leading-relaxed max-w-2xl mx-auto">
            Transform any YouTube video into concise summaries and quick flashcards. 
            Perfect for students, professionals, and lifelong learners who want to 
            absorb knowledge faster than ever.
          </p>

          {/* CTA Button */}
          <Button
            onClick={onGetStarted}
            className="cursor-pointer px-8 py-4 text-lg text-white font-semibold bg-gradient-to-br from-pink-500 to-red-500 hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 rounded-full"
          >
            Get Started
            <IconArrowRight className="w-5 h-5 ml-2" stroke={2}/>
          </Button>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 max-w-6xl mx-auto">
          <div className="text-center p-8 bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-pink-100">
            <div className="p-4 rounded-full bg-gradient-to-br from-white to-pink-500 w-fit mx-auto mb-6">
              <IconSparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">
              AI-Powered Summaries
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Our advanced AI analyzes YouTube videos and creates comprehensive, 
              easy-to-understand summaries that capture all the key insights.
            </p>
          </div>

          <div className="text-center p-8 bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-100">
            <div className="p-4 rounded-full bg-gradient-to-br from-white to-orange-500 w-fit mx-auto mb-6">
              <IconBolt className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">
              30-Second Flashcards
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Master key concepts with our bite-sized flashcards designed for 
              rapid learning and perfect for quick review sessions.
            </p>
          </div>

          <div className="text-center p-8 bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-red-100">
            <div className="p-4 rounded-full bg-gradient-to-br from-white to-red-500 w-fit mx-auto mb-6">
              <IconBrandYoutube className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">
              Works with Any Video
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Simply paste any YouTube URL and watch as our AI transforms 
              long-form content into digestible, actionable knowledge.
            </p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <p className="text-lg text-gray-600 mb-6">
            Ready to supercharge your learning?
          </p>
          <Button
            onClick={onGetStarted}
            variant="outline"
            className="px-6 py-3 cursor-pointer text-lg border-2 border-pink-300 text-pink-600 hover:bg-pink-50 rounded-full"
          >
            Start Summarizing Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
