import { IconCopy, IconCheck, IconFileText } from '@tabler/icons-react';
import React, { useState } from 'react';
import { Button } from './ui/button';

interface SummaryTabProps {
  summary: string[];
  tldr: string[];
}

const SummaryTab: React.FC<SummaryTabProps> = ({ summary, tldr }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(summary.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-orange-100 rounded-3xl p-8 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500">
            <IconFileText className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-800">
            Summary
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

      <div className="space-y-6">
        <div className="bg-gradient-to-br from-pink-50 to-orange-50 rounded-2xl p-6 border-2 border-pink-100">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">
            Overview
          </h4>
          {summary.map((paragraph, index) => (
            <p key={index} className="text-foreground leading-relaxed text-base">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="bg-gradient-to-br from-pink-50 to-orange-50 rounded-2xl p-6 border-2 border-pink-100">
          {tldr.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                TL;DR
              </h4>
              <ul className="space-y-2">
                {tldr.map((point, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <IconCheck className="w-4 h-4 text-white bg-gradient-to-r from-orange-500 to-red-500 mt-1 rounded-full p-0.5" />
                    <span className="text-foreground leading-relaxed">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SummaryTab;
