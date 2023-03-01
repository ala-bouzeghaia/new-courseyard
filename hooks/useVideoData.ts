import axios, { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
// import YouTube from 'react-youtube';
import { v4 as uuidv4 } from 'uuid';
import { ChapterType } from '../types/chapter';
import {
  getDataFromDescription,
  getTimeFromDescription,
  getTitleFromDescription,
  convertTimecodeToSeconds,
  formatDurationToTimecode,
} from '../utils/helpers';

interface VideoDataType {
  title: string;
  description: string;
  channelTitle: string;
  thumbnails: {
    default: { url: string };
    medium: { url: string };
    standard: { url: string };
  };
  duration: string;
}

interface YoutubeApiResponse {
  items: [
    {
      snippet: {
        title: string;
        description: string;
        channelTitle: string;
        thumbnails: {
          default: { url: string };
          medium: { url: string };
          standard: { url: string };
        };
      };
      contentDetails: {
        duration: string;
      };
    },
  ];
}

export const useVideoData = (videoId: string) => {
  const [chapters, setChapters] = useState([] as ChapterType[]);

  /**
   * Call Youtube API to retrieve video description
   * @param  id  Youtube id of the video
   * @returns  Promise of video data
   */
  const getVideoData = async (id: string): Promise<VideoDataType> => {
    const resSnippet: AxiosResponse<YoutubeApiResponse> = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&key=${
        process.env.NEXT_PUBLIC_API_KEY as string
      }&id=${id}`,
    );
    const dataSnippet = resSnippet.data.items[0].snippet;

    const resContentDetails: AxiosResponse<YoutubeApiResponse> = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&key=${
        process.env.NEXT_PUBLIC_API_KEY as string
      }&id=${id}`,
    );
    const dataContentDetails = resContentDetails.data.items[0].contentDetails;

    return { ...dataSnippet, ...dataContentDetails };
  };

  const useYoutubeVideoData = (id: string) => {
    return useQuery({
      queryKey: ['description', id],
      queryFn: () => getVideoData(id),
      enabled: !!id,
    });
  };

  const { data } = useYoutubeVideoData(videoId);
  // console.log(data);
  // let duration: number
  const duration = data ? convertTimecodeToSeconds(formatDurationToTimecode(data.duration)) : 0;

  useEffect(() => {
    const getChapterDuration = (timeStart: string, timeEnd: string) => {
      return convertTimecodeToSeconds(timeEnd) - convertTimecodeToSeconds(timeStart);
    };

    if (videoId.length !== 0 && data) {
      // const duration = convertTimecodeToSeconds(formatDurationToTimecode(data.duration));
      // playerRef.current.internalPlayer?.getDuration().then((duration: number) => {
      // console.log(
      //   'durrr',
      //   duration,
      //   data && convertTimecodeToSeconds(formatDurationToTimecode(data.duration)),
      // );

      getDataFromDescription(data.description).map((elt, idx, arr) => {
        const timeStart: string = getTimeFromDescription(elt);
        const title: string = getTitleFromDescription(elt);
        const id: string = uuidv4();
        setChapters((prev) => [
          ...prev,
          {
            id,
            timeStart,
            title,
            duration: arr[idx + 1]
              ? getChapterDuration(timeStart, getTimeFromDescription(arr[idx + 1]))
              : duration - convertTimecodeToSeconds(timeStart),
            status: 'locked',
            progression: 0,
            isCompleted: false,
          },
        ]);
      });
      // });
    }
  }, [data, videoId, duration]);

  return {
    chapters,
    title: data?.title,
    duration,
    channelTitle: data?.channelTitle,
    thumbnails: data?.thumbnails,
  };
};
