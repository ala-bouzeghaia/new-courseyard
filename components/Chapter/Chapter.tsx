import YouTube from 'react-youtube';
import { HiPlay, HiPause, HiLockClosed, HiOutlineClock, HiCheckCircle } from 'react-icons/hi';
import CircularProgress from '@mui/material/CircularProgress';
import styles from './Chapter.module.scss';
import { ChapterType } from '../../types/chapter';
import { convertTimecodeToSeconds, formatTime } from '../../utils/helpers';

type Props = {
  chapter: ChapterType;
  currentTime: number;
  player: YouTube;
  globalPlayerState: number;
  setGlobalPlayerState: (globalPlayerState: React.SetStateAction<number>) => void;
};

const Chapter = (props: Props) => {
  const getProgress = (currentTime: number, timeStart: number) => {
    return currentTime - timeStart > 0 ? currentTime - timeStart : 0;
  };

  const goToTimeCodeFromChapter = (chapter: ChapterType) => {
    if (chapter.status === 'locked') {
      const time = convertTimecodeToSeconds(chapter.timeStart);
      props.player.internalPlayer.seekTo(time);
      chapter.status = 'ongoing';
    } else {
      const time =
        convertTimecodeToSeconds(chapter.timeStart) +
        (chapter.progression * chapter.duration) / 100;
      props.player.internalPlayer.seekTo(time);
    }
  };

  const isActiveChapter =
    props.currentTime <
      convertTimecodeToSeconds(props.chapter.timeStart) + props.chapter.duration &&
    props.currentTime >= convertTimecodeToSeconds(props.chapter.timeStart);

  const playChapter = () => {
    if (isActiveChapter) {
      props.player.internalPlayer.playVideo();
      props.setGlobalPlayerState(1);
    }
    props.player.internalPlayer.seekTo(
      convertTimecodeToSeconds(props.chapter.timeStart) +
        (props.chapter.progression * props.chapter.duration) / 100,
    );
    props.player.internalPlayer.playVideo();
  };

  const pauseChapter = () => {
    if (isActiveChapter) {
      props.player.internalPlayer.pauseVideo();
      props.setGlobalPlayerState(2);
    }
  };

  const chapterProgress = () => {
    if (isActiveChapter) {
      const value =
        (getProgress(props.currentTime, convertTimecodeToSeconds(props.chapter.timeStart)) /
          props.chapter.duration) *
        100;

      if (value <= 100) {
        props.chapter.progression = value;
      }
      if (value >= 98) {
        props.chapter.isCompleted = true;
        props.chapter.status = 'completed';
      }
      return value;
    }
    return props.chapter.progression;
  };

  return (
    <div
      className={styles['chapter-container']}
      style={{ backgroundColor: isActiveChapter ? '#d9d9d982' : '' }}>
      <div className={styles['chapter-content']}>
        <div className={styles['chapter-progress']}>
          <CircularProgress
            variant="determinate"
            size={40}
            value={props.chapter.status === 'locked' ? 0 : chapterProgress()}
          />
          {props.chapter.status === 'locked' ? (
            <HiLockClosed size={'30px'} className={styles['player-icon-locked']} />
          ) : props.chapter.progression >= 99 || props.chapter.isCompleted ? (
            <HiCheckCircle size={'40px'} />
          ) : props.globalPlayerState === 2 ? (
            <HiPlay size={'40px'} onClick={playChapter} />
          ) : props.globalPlayerState === 1 && isActiveChapter ? (
            <HiPause size={'40px'} onClick={pauseChapter} />
          ) : (
            <HiPlay size={'40px'} onClick={playChapter} />
          )}
        </div>
        <span onClick={() => goToTimeCodeFromChapter(props.chapter)}>
          <h4>
            {props.chapter.timeStart} {props.chapter.title}
          </h4>
          <p>
            <HiOutlineClock /> {formatTime(props.chapter.duration)}
          </p>
        </span>
      </div>
    </div>
  );
};

export default Chapter;
