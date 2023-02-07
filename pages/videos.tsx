import { useState, useRef } from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';

import { ChapterType } from '../types/chapters';
import Chapter from '../components/Chapter';
import ChapterList from '../components/ChapterList';

import styles from '../styles/Videos.module.scss';

const videoId = 'w7ejDZ8SWv8';

const convertTimecodeToSeconds = (timecode: string) => {
  const timeSplit = timecode.split(' ')[0].split(':');
  // console.log(timeSplit);
  if (timeSplit.length >= 3) {
    return Number(timeSplit[0]) * 3600 + Number(timeSplit[1]) * 60 + Number(timeSplit[2]);
  }
  return Number(timeSplit[0]) * 60 + Number(timeSplit[1]);
};

function Videos() {
  const playerRef = useRef({} as YouTube);
  const [chapters, setChapters] = useState([] as ChapterType[]);
  const [globalPlayerState, setGlobalPlayerState] = useState(2);
  const [currentTime, setCurrentTime] = useState(0);

  //TODO: add api call
  const getChapters = async () => {
    //TODO: 1 - api call to get description
    //TODO: 2 - split description into timecodes & chapters
    //TODO: 3 - reformat timecodes & chapters
    //TODO: 4 - store in state
  };

  const goToTimecodeFromChapter = (timecode: string) => {
    const time = convertTimecodeToSeconds(timecode);
    playerRef.current.internalPlayer.seekTo(time);
  };

  const startChapter = (chapter: ChapterType) => {
    goToTimecodeFromChapter(chapter.timeStart);
    chapter.status = 'ongoing';
  };

  const onPlay: YouTubeProps['onPlay'] = () => {
    setGlobalPlayerState(1);
    // activeChapter = chapters?.filter(
    //   (chapter) =>
    //     currentTime <
    //       convertTimecodeToSeconds(chapter.timeStart) + chapter.duration &&
    //     currentTime >= convertTimecodeToSeconds(chapter.timeStart)
    // )[0];

    // // activeChapter.status = "ongoing";
    // // if (activeChapter.status !== "completed") {
    // // }

    // console.log(activeChapter);
    // if (activeChapter) {
    //   activeChapter.status = "ongoing";
    // }
  };
  const onPause: YouTubeProps['onPause'] = () => {
    setGlobalPlayerState(2);
  };

  return (
    <main className={styles.container}>
      <div className={styles['video-container']}>
        <h1>Title</h1>
        <YouTube
          videoId={videoId}
          className={styles.player}
          opts={{ width: '100%', height: '100%' }}
          ref={playerRef}
          onPlay={onPlay}
          onPause={onPause}
        />
        <div className={styles.notes}>notes</div>
      </div>
      <ChapterList chapters={chapters} player={playerRef} />
    </main>
  );
}

export default Videos;
