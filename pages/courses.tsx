import { useEffect, useRef, useState } from 'react';
import { FiSearch, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { v4 as uuidv4 } from 'uuid';
import styles from '../styles/Courses.module.scss';
import CourseList from '../components/CourseList';
import { useVideoData } from '../hooks/useVideoData';
import { convertSecondsToTimecode } from '../utils/helpers';
import { CourseType } from '../types/course';
import { ChapterType } from '../types/chapter';

const Courses = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isCoursesMenuVisible, setIsCoursesMenuVisible] = useState(true);
  const [isMyCoursesMenuVisible, setIsMyCoursesMenuVisible] = useState(true);
  const [videoId, setVideoId] = useState('');
  const [courseList, setCourseList] = useState([] as CourseType[]);

  const videoData = useVideoData(videoId);

  useEffect(() => {
    if (courseList.length === 0) {
      if (localStorage.getItem('courses')) {
        setCourseList(JSON.parse(localStorage.getItem('courses') as string) as CourseType[]);
      }
    }
  }, [courseList]);

  useEffect(() => {
    const courseId: string = uuidv4();
    const newCourse = {
      id: courseId,
      chapters: [] as ChapterType[],
      channelTitle: videoData.channelTitle as string,
      title: videoData.title as string,
      thumbnails: videoData.thumbnails,
      duration: convertSecondsToTimecode(videoData.duration),
      videoId,
    } as CourseType;
    if (videoData.title && courseList.every((course) => course.videoId !== newCourse.videoId)) {
      setCourseList((prev) => [...prev, newCourse]);
      const storedCourses = JSON.parse(localStorage.getItem('courses') as string) as CourseType[];
      if (storedCourses) {
        storedCourses.every((course) => course.videoId !== newCourse.videoId) &&
          localStorage.setItem('courses', JSON.stringify([...storedCourses, newCourse]));
      } else {
        localStorage.setItem('courses', JSON.stringify([newCourse]));
      }
    }
  }, [courseList, videoData, videoId]);

  const handleSubmit = () => {
    setVideoId('');
    if (
      inputRef.current &&
      inputRef.current.value.length !== 0 &&
      inputRef.current.value.includes('https://www.youtube.com/watch?v=')
    ) {
      const videoIdFromUrl = inputRef.current.value.split('?v=')[1].split('&')[0];
      setVideoId(videoIdFromUrl);
      inputRef.current.value = '';
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        You can either enroll for our featured courses or add your own courses from Youtube by
        entering the URL{' '}
      </h1>
      <div className={styles['search-container']}>
        <div className={styles['search-input']}>
          <FiSearch size={32} />
          <input
            type="search"
            placeholder="Enter Youtube URL here..."
            ref={inputRef}
            onKeyDown={handleKeyDown}
          />
        </div>
        <button type="submit" onSubmit={handleSubmit}>
          Add Course
        </button>
      </div>
      <div className={styles['courses-section-container']}>
        <div
          className={styles['courses-section-title']}
          onClick={() => setIsCoursesMenuVisible(!isCoursesMenuVisible)}>
          <h1>Courses </h1>
          {isCoursesMenuVisible ? <FiChevronUp /> : <FiChevronDown />}
        </div>
        <div
          className={
            styles[`courses-section-content-${isCoursesMenuVisible ? 'visible' : 'hidden'}`]
          }>
          <div className={styles['menu-slider']}>
            <button>Development</button>
            <button>Data Science</button>
            <button>Design</button>
            <button>Articial Intelligence</button>
          </div>
          <CourseList courseList={courseList} />
        </div>
      </div>

      <div className={styles['courses-section-container']}>
        <div
          className={styles['courses-section-title']}
          onClick={() => setIsMyCoursesMenuVisible(!isMyCoursesMenuVisible)}>
          <h1>My Courses </h1>
          {isMyCoursesMenuVisible ? <FiChevronUp /> : <FiChevronDown />}
        </div>
        <div
          className={
            styles[`courses-section-content-${isMyCoursesMenuVisible ? 'visible' : 'hidden'}`]
          }>
          <div className={styles['course-list']}>{videoId}</div>
        </div>
      </div>
    </div>
  );
};

export default Courses;
