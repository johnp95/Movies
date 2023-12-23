// Card.js

import React from 'react';
import styles from './cardcontainer.module.css'

const Card = ({ title, content }) => {
  return (
    <div className={styles.card}>
      <h2>{title}</h2>
      <p>{content}</p>
    </div>
  );
};

export default Card;
