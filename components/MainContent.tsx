import React, { useState } from 'react';
import { IconArrowLeft, IconBrandYoutube } from '@tabler/icons-react';
import URLInput from '@/components/URLInput';
import VideoInfo from '@/components/VideoInfo';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SummaryTab from '@/components/SummaryTab';
import FlashcardsTab from '@/components/FlashcardsTab';
import { Button } from '@/components/ui/button';

interface MainContentProps {
  onBackToLanding: () => void;
}

interface VideoData {
  url: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: string;
  publishedAt: string;
  channelName: string;
  summary: string[];
  flashcards: Array<{ question: string, answer: string }>;
  tldr: string[];
}

const MainContent: React.FC<MainContentProps> = ({ onBackToLanding }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasResults, setHasResults] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [language, setLanguage] = useState('en');

  const handleURLSubmit = async (url: string) => {
    setVideoUrl(url);
    console.log('Submitted URL:', url);
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          url: url,
          language: language
        })
      });
    
      const data = await response.json();
      console.log('API Response:', data);
      if (response.ok) {
        setVideoData(data);
        setHasResults(true);
      } else {
        console.error('API Error:', data.error);
        // You might want to show an error message to the user here
      }
    } catch (error) {
      console.error('Failed to fetch:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewVideo = () => {
    setHasResults(false);
    setIsLoading(false);
    setVideoData(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-red-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={onBackToLanding}
            variant="ghost"
            className="cursor-pointer flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <IconArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
          
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-pink-500 to-red-500">
              <IconBrandYoutube className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-br from-pink-500 to-red-500 bg-clip-text text-transparent">YouTube Summarizer</h1>
          </div>
        </div>

        {!hasResults && !isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8">
            <URLInput 
              onSubmit={handleURLSubmit} 
              isLoading={isLoading}
              language={language}
              onLanguageChange={setLanguage}
            />
          </div>
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[70vh]">
            <LoadingSpinner message="Analyzing video content and generating insights..." />
          </div>
        ) : videoData ? (
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                Analysis Results
              </h2>
              <Button
                onClick={handleNewVideo}
                className="text-white cursor-pointer bg-gradient-to-br from-pink-500 to-red-500 hover:opacity-90 transition-opacity rounded-full"
              >
                Analyze New Video
              </Button>
            </div>
            
            <VideoInfo {...videoData} />
            
            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="grid w-full h-fit grid-cols-2 bg-white/70 backdrop-blur-sm border border-pink-100 rounded-2xl p-2">
                <TabsTrigger 
                  value="summary" 
                  className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-200 data-[state=active]:to-orange-200 data-[state=active]:text-gray-800 text-lg py-3 cursor-pointer"
                >
                  Summary
                </TabsTrigger>
                <TabsTrigger 
                  value="flashcards"
                  className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-200 data-[state=active]:to-orange-200 data-[state=active]:text-gray-800 text-lg py-3 cursor-pointer"
                >
                  Flashcards
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="summary" className="mt-6">
                <SummaryTab summary={videoData.summary} tldr={videoData.tldr} />
              </TabsContent>
              
              <TabsContent value="flashcards" className="mt-6">
                <FlashcardsTab flashcards={videoData.flashcards} />
              </TabsContent>
            </Tabs>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default MainContent;
