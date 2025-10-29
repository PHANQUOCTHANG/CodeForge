import React from 'react';
import styles from './Badge.module.scss';

interface Props {
  type?: 'success' | 'error' | 'warning';
  children: React.ReactNode;
}

export const Badge: React.FC<Props> = ({ type = 'success', children }) => {
  return <span className={`${styles.badge} ${styles[type]}`}>{children}</span>;
};
