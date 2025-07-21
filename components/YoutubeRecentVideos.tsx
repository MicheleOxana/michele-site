import React, { useEffect, useState } from 'react';

interface Video {
  id: { videoId: string };
  snippet: {
    title: string;
    thumbnails: { medium: { url: string } };
  };
}

export default function YoutubeRecentVideos() {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('/api/youtube');
        const data = await response.json();
        setVideos(data.items || []);
      } catch (error) {
        console.error('Erro ao buscar vídeos:', error);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="flex flex-wrap justify-center gap-6 mt-10">
      {videos.map((video) => (
        <div
          key={video.id.videoId}
          className="max-w-xs bg-purple-950 rounded-xl overflow-hidden shadow-lg shadow-fuchsia-500/20 border border-fuchsia-800"
        >
          <a
            href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={video.snippet.thumbnails.medium.url}
              alt={video.snippet.title}
              className="w-full"
            />
            <div className="p-3 text-fuchsia-300 font-semibold text-sm">
              {video.snippet.title}
            </div>
          </a>
        </div>
      ))}
    </div>
  );
}
