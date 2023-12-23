// CardContainer.js

import React from 'react';
import Card from './Card';
import styles from './cardcontainer.module.css'

export const CardContainer = () => {
  const cardData = [
    { title: 'Card 1', content: 'Content for Card 1' },
    { title: 'Card 2', content: 'Content for Card 2' },
    { title: 'Card 3', content: 'Content for Card 3' },
  ];

  return (
    <div className={styles.cardContainer}>
      {cardData.map((card, index) => (
        <Card key={index} title={card.title} content={card.content} />
      ))}
    </div>
  );
};

