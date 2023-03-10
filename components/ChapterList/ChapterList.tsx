import { useEffect } from 'react';
import { useAtom } from 'jotai';
import YouTube from 'react-youtube';
import LinearProgress from '@mui/material/LinearProgress';
import Chapter from '../Chapter';
import styles from './ChapterList.module.scss';
import { ChapterType } from '../../types/chapter';
import { videoIdAtom } from '../../utils/store';
import { CourseType } from '../../types/course';

interface ChapterListProps {
  chapters: ChapterType[];
  playerRef: React.MutableRefObject<YouTube>;
  currentTime: number;
  globalPlayerState: number;
  setGlobalPlayerState: (globalPlayerState: React.SetStateAction<number>) => void;
}

const ChapterList = (props: ChapterListProps) => {
  const { chapters, playerRef, currentTime, globalPlayerState, setGlobalPlayerState } = props;
  const completedChapters = chapters.filter((chapter) => chapter.isCompleted);
  const globalProgress = (completedChapters.length * 100) / chapters.length;

  const [videoId] = useAtom(videoIdAtom);

  useEffect(() => {
    if (localStorage.getItem('courses')) {
      const storedCourses = JSON.parse(localStorage.getItem('courses') as string) as CourseType[];
      if (storedCourses?.length !== 0) {
        const newStoredCourses = storedCourses.map((course) =>
          course.videoId === videoId && chapters.length !== 0
            ? { ...course, chapters, progression: globalProgress }
            : course,
        );
        localStorage.setItem('courses', JSON.stringify(newStoredCourses));
      }
    }
  }, [chapters, globalProgress, videoId]);

  return (
    <div className={styles['chapters-container']}>
      <div className={`${styles['chapters-section-list']} `}>
        <div className={styles['chapters-section-title']}>
          <h1>Chapters</h1>
          <p>
            Completed :{' '}
            {globalProgress > 0
              ? globalProgress < 1
                ? globalProgress.toPrecision(1)
                : globalProgress.toPrecision(2)
              : 0}
            %{' '}
          </p>
          <LinearProgress variant="determinate" value={globalProgress > 0 ? globalProgress : 0} />
        </div>

        {chapters?.map((chapter) => (
          <Chapter
            key={chapter.id}
            chapter={chapter}
            currentTime={currentTime}
            player={playerRef.current}
            globalPlayerState={globalPlayerState}
            setGlobalPlayerState={setGlobalPlayerState}
          />
        ))}
      </div>
    </div>
  );
};

export default ChapterList;
