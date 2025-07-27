import React from 'react';
import { Link } from 'react-router-dom';
import styles from './AboutPage.module.css';

const AboutPage: React.FC = () => {
  return (
    <div className={styles.aboutContainer}>
      <h1>About Pokémon Search</h1>
      <p>
        This application was developed by{' '}
        <a href="https://github.com/lnrzhkv">me</a>
      </p>
      <p>
        As part of the RS School React 2025 course
        <a
          className={styles.courseLink}
          href="https://rs.school/courses/reactjs"
          target="_blank"
          rel="noreferrer"
        >
          RS School React
        </a>
      </p>
      <Link className={styles.backLink} to="/">
        Back to main page
      </Link>
    </div>
  );
};

export default AboutPage;
