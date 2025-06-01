import React, { useState } from 'react';
import { IconBrandYoutube, IconSend, IconLoader2, IconSparkles, IconLink } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronDownIcon, ChevronUpIcon, CheckIcon } from '@radix-ui/react-icons';
import * as Select from '@radix-ui/react-select';

interface URLInputProps {
  onSubmit: (url: string) => void;
  isLoading?: boolean;
  language: string;
  onLanguageChange: (language: string) => void;
}

const URLInput: React.FC<URLInputProps> = ({
  onSubmit,
  isLoading = false,
  language,
  onLanguageChange
}) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim());
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white/80 rounded-2xl p-8 shadow-lg border-2 border-pink-200">
      <div className="text-center mb-8 flex flex-col items-center">
        <div className="relative">
          <div className="p-4 rounded-3xl bg-gradient-to-r from-pink-500 via-orange-500 to-red-500 shadow-lg">
            <IconBrandYoutube className="w-6 h-6 text-white" />
          </div>
          <div className="absolute -top-1 -right-1 z-10 p-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400">
            <IconSparkles className="w-4 h-4 text-white" />
          </div>
        </div>
        <div className="text-3xl font-bold bg-gradient-to-r from-pink-600 via-orange-500 to-red-500 bg-clip-text text-transparent mb-3">
          Transform Any YouTube Video
        </div>
        <div className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
          Paste any YouTube URL below and get instant AI-powered summaries and bite-sized flashcards for better learning and retention.
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <div className="relative flex items-center">
            <IconLink className="absolute left-4 w-5 h-5 text-gray-400 z-10" />
            <Input
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full h-16 pl-12 pr-16 text-lg bg-white/80 backdrop-blur-sm border-2 border-pink-200 hover:border-pink-300 focus:outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-200 transition-colors rounded-2xl shadow-lg"
            />
          </div>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Button
              type="submit"
              disabled={!url.trim() || isLoading}
              className="h-10 w-10 p-0 bg-gradient-to-br from-pink-500 to-red-500 hover:opacity-90 transition-opacity rounded-xl shadow-lg cursor-pointer"
            >
              {isLoading ? (
                <IconLoader2 className="w-5 h-5 animate-spin text-white" />
              ) : (
                <IconSend className="w-5 h-5 text-white" />
              )}
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
          <span>Supports all YouTube Videos</span>
          <div className="flex items-center space-x-2">
            <IconBrandYoutube className="w-4 h-4 text-red-500" />
            <span>YouTube</span>
          </div>
        </div>

        <div className="flex justify-end mt-4 space-x-4">
          <Select.Root value={language} onValueChange={onLanguageChange}>
            <Select.Trigger
              className="inline-flex items-center justify-between w-48 px-4 py-2 text-sm text-gray-600 bg-white/90 border-2 border-pink-200 rounded-full backdrop-blur-sm shadow-sm focus:outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-200 transition-all cursor-pointer"
              aria-label="Language"
            >
              <Select.Value />
              <Select.Icon>
                <ChevronDownIcon />
              </Select.Icon>
            </Select.Trigger>

            <Select.Portal>
              <Select.Content
                className="overflow-hidden bg-white rounded-md shadow-lg border border-pink-200 animate-fade-in"
                position="popper"
                sideOffset={5}
              >
                <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-white text-pink-500">
                  <ChevronUpIcon />
                </Select.ScrollUpButton>

                <Select.Viewport className="p-1">
                  {[
                    { label: 'English', value: 'en' },
                    { label: 'हिन्दी (Hindi)', value: 'hi' },
                    { label: 'ಕನ್ನಡ (Kannada)', value: 'kannada' },
                    { label: 'Español (Spanish)', value: 'es' },
                    { label: 'Français (French)', value: 'fr' },
                  ].map((option) => (
                    <Select.Item
                      key={option.value}
                      value={option.value}
                      className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 rounded-md cursor-pointer hover:bg-pink-50 focus:bg-pink-100 focus:outline-none select-none"
                    >
                      <Select.ItemText>{option.label}</Select.ItemText>
                      <Select.ItemIndicator>
                        <CheckIcon className="text-pink-400" />
                      </Select.ItemIndicator>
                    </Select.Item>
                  ))}
                </Select.Viewport>

                <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-white text-pink-500">
                  <ChevronDownIcon />
                </Select.ScrollDownButton>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>
      </form>
    </div>
  );
};

export default URLInput;
