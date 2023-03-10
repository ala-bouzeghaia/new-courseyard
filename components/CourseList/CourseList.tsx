import React from 'react';
import { CourseType } from '../../types/course';
import Course from '../Course';
import styles from './CourseList.module.scss';

type Props = { courseList: CourseType[] };

const CourseList = (props: Props) => {
  const { courseList } = props;
  return (
    <div className={styles['course-list']}>
      {courseList.map((course) => (
        <Course key={course.id} course={course} />
      ))}
    </div>
  );
};

export default CourseList;
