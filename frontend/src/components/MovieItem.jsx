import {React,useState} from 'react';
import styles from './movieitem.module.css';

export const MovieItem = ({movie, setMovieId, setIsClicked}) => {

  return (
    <div className={styles.itemContainer}>
      <img className={styles.itemImage} src={movie.image} alt='' />
      <div className={styles.itemContent}>
        <p className={styles.itemName}>{movie.title}</p>
      </div>
      <div className={styles.buttonContainer}>
        <button onClick={() => {
          setMovieId(movie.id)
          setIsClicked(true)
        }} className={styles.itemButton}>View Movie</button>
      </div>
    </div>
  )
}
