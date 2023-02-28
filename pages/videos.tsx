import { useEffect, useRef, useState } from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';
import ChapterList from '../components/ChapterList';
import NoteList from '../components/NoteList';
import { useChapters } from '../hooks/useChapters';
import styles from '../styles/Videos.module.scss';
import { NoteType } from '../types/note';
import { convertTimecodeToSeconds } from '../utils/helpers';

const videoId = 'w7ejDZ8SWv8';

function Videos() {
  const playerRef = useRef({} as YouTube);
  const [globalPlayerState, setGlobalPlayerState] = useState(2);
  const [currentTime, setCurrentTime] = useState(0);

  const { chapters, title } = useChapters(videoId, playerRef);
  const noteList: NoteType[] = [];

  useEffect(() => {
    const interval = setInterval(() => {
      playerRef.current.internalPlayer?.getCurrentTime().then((res: number) => {
        setCurrentTime(res);
      });
    }, 500);
    return () => {
      clearInterval(interval);
    };
  }, [currentTime, playerRef]);

  const onPlay: YouTubeProps['onPlay'] = () => {
    setGlobalPlayerState(1);
    const activeChapter = chapters?.filter(
      (chapter) =>
        currentTime < convertTimecodeToSeconds(chapter.timeStart) + chapter.duration &&
        currentTime >= convertTimecodeToSeconds(chapter.timeStart),
    )[0];

    if (activeChapter) {
      activeChapter.status = 'ongoing';
    }
  };

  const onPause: YouTubeProps['onPause'] = () => {
    setGlobalPlayerState(2);
  };

  return (
    <main className={styles.container}>
      <div className={styles['video-container']}>
        <h1>{title}</h1>
        <YouTube
          data-testid="video-player"
          videoId={videoId}
          className={styles.player}
          opts={{ width: '100%', height: '100%' }}
          ref={playerRef}
          onPlay={onPlay}
          onPause={onPause}
        />
        <NoteList currentTime={currentTime} playerRef={playerRef} noteList={noteList} />
      </div>
      <ChapterList
        chapters={chapters}
        playerRef={playerRef}
        currentTime={currentTime}
        globalPlayerState={globalPlayerState}
        setGlobalPlayerState={setGlobalPlayerState}
      />
    </main>
  );
}

export default Videos;
