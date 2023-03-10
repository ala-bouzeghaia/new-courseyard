import { ChapterType } from './chapter';

export type CourseType = {
  id: string;
  channelTitle: string;
  title: string;
  thumbnails: {
    standard: { url: string };
    default: { url: string };
    medium: { url: string };
  };
  duration: string;
  videoId: string;
  progression: number;
  chapters: ChapterType[];
};
