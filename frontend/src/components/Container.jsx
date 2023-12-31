import React from 'react';
import styles from './styles/container.module.css';

export const Container = ({ children }) => {
    
    return (
        <div className={styles.parentContainer}>
            {children}
        </div>
    )
}
