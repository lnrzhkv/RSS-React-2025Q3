import React, { useEffect, useState } from 'react';
import styles from './DataBox.module.css';

type DataBoxProps = {
  data: Record<string, string | number | null>;
  triggerAnimation: boolean;
};

const DataBox: React.FC<DataBoxProps> = ({ data, triggerAnimation }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (triggerAnimation) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [triggerAnimation]);

  return (
    <div
      className={`${styles.dataBox} ${isAnimating ? styles.showIndication : ''}`}
    >
      {Object.entries(data).map(([key, value]) => (
        <div key={key}>
          {`${key.charAt(0).toUpperCase() + key.slice(1)}: `}
          {typeof value === 'string' && value.length > 50
            ? `${value.slice(0, 50)}...`
            : value}
        </div>
      ))}
    </div>
  );
};

export default DataBox;
