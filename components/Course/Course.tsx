import Image from 'next/image';
import Link from 'next/link';
import { useAtom } from 'jotai';
import LinearProgress from '@mui/material/LinearProgress';
import { HiOutlineTrash } from 'react-icons/hi';
import { CourseType } from '../../types/course';
import { videoIdAtom } from '../../utils/store';
import styles from './Course.module.scss';

type Props = { course: CourseType };

const Course = (props: Props) => {
  const { course } = props;
  const [, setVideoId] = useAtom(videoIdAtom);

  console.log('course.progression', course.progression, 'course', course);

  return (
    <Link href="/videos">
      <div className={styles['course-card']} onClick={() => setVideoId(course.videoId)}>
        <Image
          src={
            course.thumbnails?.standard?.url ||
            course.thumbnails?.medium.url ||
            course.thumbnails?.default.url
          }
          alt=""
          height={200}
          width={300}
        />
        {/* <div className={styles['img-container']}>
      </div> */}
        <div className={styles['course-description']}>
          <h3>{course.title}</h3>
          <div>
            <p>{course.channelTitle}</p>
            <LinearProgress
              className={styles.progressbar}
              variant="determinate"
              value={course.progression > 0 ? course.progression : 0}
            />

            <p>
              <span>
                {course.duration} -{' '}
                {course.progression > 0
                  ? course.progression < 1
                    ? course.progression.toPrecision(1)
                    : course.progression.toPrecision(2)
                  : 0}
                % completed
              </span>
              <HiOutlineTrash
                size={30}
                // onClick={(e) => {e.preventDefault(); deleteCard(cardIndex);}}
              />
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Course;
