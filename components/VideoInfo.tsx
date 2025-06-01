
import React from 'react';
import { IconClock, IconEye, IconCalendar } from '@tabler/icons-react';

interface VideoInfoProps {
  title: string;
  thumbnail: string;
  duration: string;
  views: string;
  publishedAt: string;
  channelName: string;
  url: string;
}

const VideoInfo: React.FC<VideoInfoProps> = ({
  title,
  thumbnail,
  duration,
  views,
  publishedAt,
  channelName,
  url
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm border border-pink-100 rounded-3xl p-8 shadow-lg animate-fade-in">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="relative flex-shrink-0">
          <a href={url} target="_blank" rel="noopener noreferrer">
            <img
              src={thumbnail}
              alt={title}
              className="w-full md:w-64 h-40 object-cover rounded-2xl shadow-md"
            />
            <div className="absolute bottom-3 right-3 bg-black/80 text-white px-3 py-1 rounded-lg text-sm font-medium">
              {duration}
            </div>
          </a>
        </div>
        
        <div className="flex-1 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 line-clamp-2 leading-tight">
            {title}
          </h2>
          
          <p className="text-pink-600 font-medium text-lg">
            {channelName}
          </p>
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-full">
              <IconEye className="w-4 h-4" />
              <span>{views} views</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-full">
              <IconCalendar className="w-4 h-4" />
              <span>{publishedAt}</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-full">
              <IconClock className="w-4 h-4" />
              <span>{duration}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoInfo;
