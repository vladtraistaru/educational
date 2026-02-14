import { getAllGrades, getModulesByGrade } from '@/modules/registry';
import GradeCard from '@/components/GradeCard';
import styles from './page.module.css';

export default function HomePage() {
  const grades = getAllGrades();

  return (
    <>
      <hgroup>
        <h1>Educational Platform</h1>
        <p>Choose a year group to explore activities</p>
      </hgroup>

      <div className={styles.grid}>
        {grades.map((grade) => (
          <GradeCard
            key={grade}
            grade={grade}
            moduleCount={getModulesByGrade(grade).length}
          />
        ))}
      </div>
    </>
  );
}
