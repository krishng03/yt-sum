import { useState, useEffect } from 'react';
import { IconCards, IconClock, IconChevronLeft, IconChevronRight, IconCopy, IconCheck } from '@tabler/icons-react';
import React from 'react';
import { Button } from './ui/button';

interface Flashcard {
  question: string;
  answer: string;
}

interface FlashcardsTabProps {
  flashcards: Flashcard[];
}

const FlashcardsTab: React.FC<FlashcardsTabProps> = ({ flashcards }) => {
  const [currentCard, setCurrentCard] = useState(0);
  const [mockFlashCards, setMockFlashCards] = useState<Flashcard[]>(flashcards);
  const [copied, setCopied] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  
  const nextCard = () => {
    setCurrentCard((prev) => (prev + 1) % mockFlashCards.length);
  };

  const prevCard = () => {
    setCurrentCard((prev) => (prev - 1 + mockFlashCards.length) % mockFlashCards.length);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(mockFlashCards[currentCard].question + "\n" + mockFlashCards[currentCard].answer);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  useEffect(() => {
    setIsFlipped(false);
  }, [currentCard]);

  const handleCardFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-orange-100 rounded-3xl p-8 shadow-lg">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500">
            <IconCards className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-800">
            Video Flashcards
          </h3>
        </div>
        
        <Button
          onClick={handleCopy}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 border border-pink-500 hover:bg-muted cursor-pointer rounded-2xl text-pink-500"
        >
          {copied ? (
            <IconCheck className="w-4 h-4 text-pink-500" />
          ) : (
            <IconCopy className="w-4 h-4 text-pink-500" />
          )}
          {copied ? 'Copied!' : 'Copy'}
        </Button>
      </div>

      <div className="flex flex-col items-center space-y-8">
        {/* Flashcard */}
        <div className="relative w-full max-w-4xl">
          <div className="bg-gradient-to-br from-pink-100 via-orange-50 to-red-100 border-2 border-pink-200 rounded-3xl p-8 shadow-lg min-h-[280px] flex flex-col justify-between">
            {/* Time indicator */}

            {/* Summary content */}
            <div className="flex-1 flex items-center justify-center perspective-1000">
              <div 
                onClick={handleCardFlip}
                className={`relative w-full h-64 transition-transform duration-500 [transform-style:preserve-3d] cursor-pointer ${
                  isFlipped ? '[transform:rotateY(180deg)]' : ''
                }`}
              >
                {/* Front side */}
                <div className="absolute inset-0 flex items-center justify-center [backface-visibility:hidden]">
                  <p className="text-lg text-gray-800 leading-relaxed text-center max-w-3xl">
                    {mockFlashCards[currentCard].question}
                  </p>
                </div>
                
                {/* Back side */}
                <div className="absolute inset-0 flex items-center justify-center [transform:rotateY(180deg)] [backface-visibility:hidden]">
                  <p className="text-lg text-gray-800 leading-relaxed text-center max-w-3xl">
                    {mockFlashCards[currentCard].answer}
                  </p>
                </div>
              </div>
            </div>

            {/* Card number indicator */}
            <div className="text-center">
              <div className="text-sm text-gray-500">
              {currentCard + 1} of {mockFlashCards.length}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-6">
          <Button
            onClick={prevCard}
            variant="outline"
            size="sm"
            className="rounded-full px-6 py-3 cursor-pointer"
            disabled={mockFlashCards.length <= 1}
          >
            <IconChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            {mockFlashCards.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentCard(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentCard
                    ? 'bg-gradient-to-r from-pink-500 to-orange-500 scale-125'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          <Button
            onClick={nextCard}
            variant="outline"
            size="sm"
            className="rounded-full px-6 py-3 cursor-pointer"
            disabled={mockFlashCards.length <= 1}
          >
            Next
            <IconChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-8 w-full bg-gray-200 rounded-full h-2">
        <div
          className="h-2 bg-gradient-to-r from-pink-500 via-orange-500 to-red-500 rounded-full transition-all duration-300"
          style={{ width: `${((currentCard + 1) / mockFlashCards.length) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default FlashcardsTab;