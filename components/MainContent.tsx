import React, { useState, useEffect } from 'react';
import { IconArrowLeft, IconBrandYoutube, IconLogout, IconHistory, IconUser } from '@tabler/icons-react';
import URLInput from '@/components/URLInput';
import VideoInfo from '@/components/VideoInfo';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SummaryTab from '@/components/SummaryTab';
import FlashcardsTab from '@/components/FlashcardsTab';
import { Button } from '@/components/ui/button';

interface MainContentProps {
  onBackToLanding: () => void;
  user: { userid: number; username: string } | null;
  onLogout: () => void;
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
  savedToDB?: boolean;
  isUserLoggedIn?: boolean;
}

interface HistorySummary {
  _id: string;
  videoUrl: string;
  timestamp: string;
  summary: string[];
  flashcards: Array<{ question: string, answer: string }>;
  tldr: string[];
  lang: string;
  createdAt: string;
}

const MainContent: React.FC<MainContentProps> = ({ onBackToLanding, user, onLogout }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasResults, setHasResults] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [language, setLanguage] = useState('english');
  const [history, setHistory] = useState<HistorySummary[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const handleURLSubmit = async (url: string) => {
    setVideoUrl(url);
    console.log('Submitted URL:', url);
    setIsLoading(true);
    setShowHistory(false);
    
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
    setShowHistory(false);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      onLogout();
    } catch (error) {
      console.error('Logout error:', error);
      onLogout(); // Still logout on frontend even if API fails
    }
  };

  const fetchHistory = async () => {
    if (!user || !user.userid) return; // Don't fetch for guests or invalid users
    
    setIsLoadingHistory(true);
    try {
      const response = await fetch('/api/history');
      const data = await response.json();
      
      if (response.ok) {
        setHistory(data.summaries);
      } else {
        console.error('Failed to fetch history:', data.error);
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleShowHistory = () => {
    setShowHistory(true);
    setHasResults(false);
    fetchHistory();
  };

  const handleSelectHistoryItem = (item: HistorySummary) => {
    // Extract video title from URL or use a placeholder
    const videoTitle = `Video from ${new Date(item.createdAt).toLocaleDateString()}`;
    
    setVideoData({
      url: item.videoUrl,
      title: videoTitle,
      thumbnail: '',
      duration: '',
      views: '',
      publishedAt: '',
      channelName: '',
      summary: item.summary,
      flashcards: item.flashcards,
      tldr: item.tldr,
      savedToDB: true, // History items are already saved
      isUserLoggedIn: !!user && !!user.userid
    });
    setHasResults(true);
    setShowHistory(false);
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

          {/* User Section */}
          <div className="flex items-center gap-3">
            {user && (
              <>
                <div className="flex items-center gap-2 px-3 py-2 bg-white/70 backdrop-blur-sm rounded-lg border border-pink-100">
                  <IconUser className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">{user.username}</span>
                </div>
                
                {user.userid && (
                  <Button
                    onClick={handleShowHistory}
                    variant="ghost"
                    className="cursor-pointer flex items-center gap-2 text-gray-600 hover:text-gray-800"
                  >
                    <IconHistory className="w-4 h-4" />
                    History
                  </Button>
                )}
                
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="cursor-pointer flex items-center gap-2 text-gray-600 hover:text-gray-800"
                >
                  <IconLogout className="w-4 h-4" />
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>

        {showHistory ? (
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Your Analysis History</h2>
              <Button
                onClick={() => setShowHistory(false)}
                variant="outline"
                className="cursor-pointer border-pink-200 text-pink-600 hover:bg-pink-50"
              >
                Back to Analyzer
              </Button>
            </div>

            {isLoadingHistory ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner message="Loading your history..." />
              </div>
            ) : history.length === 0 ? (
              <div className="text-center py-12">
                <div className="p-6 rounded-full bg-gradient-to-br from-pink-100 to-orange-100 w-fit mx-auto mb-4">
                  <IconHistory className="w-12 h-12 text-pink-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No History Yet</h3>
                <p className="text-gray-600 mb-6">Start analyzing videos to build your history!</p>
                <Button
                  onClick={() => setShowHistory(false)}
                  className="cursor-pointer bg-gradient-to-br from-pink-500 to-red-500 text-white hover:opacity-90"
                >
                  Analyze Your First Video
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => handleSelectHistoryItem(item)}
                    className="cursor-pointer p-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-pink-100 hover:shadow-lg transition-all duration-300 hover:border-pink-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="text-sm text-gray-500 mb-1">
                          {new Date(item.createdAt).toLocaleDateString()} at {new Date(item.createdAt).toLocaleTimeString()}
                        </div>
                        <div className="text-sm text-blue-600 hover:text-blue-800 mb-2 break-all">
                          {item.videoUrl}
                        </div>
                        <div className="text-gray-700">
                          <div className="text-sm font-medium mb-1">Summary Preview:</div>
                          <div className="text-sm text-gray-600 line-clamp-2">
                            {item.summary.slice(0, 2).join(' ')}...
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 ml-4">
                        {item.flashcards.length} flashcards
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : !hasResults && !isLoading ? (
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
