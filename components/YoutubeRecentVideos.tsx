import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_KEY = 'AIzaSyDVrPAfm1kcWmO-lZhA4zZN7yj3jrWeUJc';
const CHANNEL_USERNAME = 'micheleoxana';
const MAX_RESULTS = 3;

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
        // Etapa 1: Buscar o ID do canal pelo username
        const channelRes = await axios.get(
          `https://www.googleapis.com/youtube/v3/channels`,
          {
            params: {
              forUsername: CHANNEL_USERNAME,
              key: API_KEY,
              part: 'id',
            },
          }
        );
        const channelId = channelRes.data.items[0]?.id;
        if (!channelId) return;

        // Etapa 2: Buscar os vídeos mais recentes do canal
        const videosRes = await axios.get(
          `https://www.googleapis.com/youtube/v3/search`,
          {
            params: {
              key: API_KEY,
              channelId,
              part: 'snippet',
              order: 'date',
              maxResults: MAX_RESULTS,
              type: 'video',
            },
          }
        );

        setVideos(videosRes.data.items);
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
