import React from 'react';
import styles from './movieitem.module.css';

export const MovieItem = ({movie}) => {
  return (
    <div>
      <h1>{movie.title}</h1>
      <button>View Movie</button>
    </div>
  )
}
