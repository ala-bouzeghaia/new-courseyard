import axios, { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import YouTube from 'react-youtube';
import { v4 as uuidv4 } from 'uuid';
import { ChapterType } from '../types/chapter';
import {
  getDataFromDescription,
  getTimeFromDescription,
  getTitleFromDescription,
  convertTimecodeToSeconds,
} from '../utils/helpers';

interface YoutubeApiReponse {
  items: [
    {
      snippet: {
        title: string;
        description: string;
      };
    },
  ];
}

export const useChapters = (videoId: string, playerRef: React.MutableRefObject<YouTube>) => {
  const [chapters, setChapters] = useState([] as ChapterType[]);

  /**
   * Call Youtube API to retrieve video description
   * @param  id  Youtube id of the video
   * @returns  Promise of video description
   */
  const getVideoDescription = async (
    id: string,
  ): Promise<{
    title: string;
    description: string;
  }> => {
    const res: AxiosResponse<YoutubeApiReponse> = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&key=${
        process.env.NEXT_PUBLIC_API_KEY as string
      }&id=${id}`,
    );
    console.log('res', res);
    const data = res.data.items[0].snippet;
    return data;
  };

  const useDescription = (id: string) => {
    return useQuery({
      queryKey: ['description', id],
      queryFn: () => getVideoDescription(id),
      enabled: !!id,
    });
  };

  const { data } = useDescription(videoId);

  useEffect(() => {
    const getChapterDuration = (timeStart: string, timeEnd: string) => {
      return convertTimecodeToSeconds(timeEnd) - convertTimecodeToSeconds(timeStart);
    };

    if (videoId.length !== 0) {
      playerRef.current.internalPlayer?.getDuration().then((duration: number) => {
        console.log('durrr', duration);

        data &&
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
      });
    }
  }, [data, playerRef, videoId]);

  return { chapters, title: data?.title };
};
