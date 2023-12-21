import React from 'react'
import styles from './innercontainer.module.css';

export const InnerContainer = ({children}) => {
    return (
        <div className={styles.innerContainer}>
            {children}           
        </div>
    )
}
