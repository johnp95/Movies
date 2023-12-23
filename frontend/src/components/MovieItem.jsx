import {React} from 'react';
import styles from './movieitem.module.css';
import {Link} from 'react-router-dom'

export const MovieItem = ({movie, setMovieId}) => {

  return (
    <div className={styles.itemContainer}>
      <img className={styles.itemImage} src={movie.image} alt='' />
      <div className={styles.itemContent}>
        <p className={styles.itemName}>{movie.title}</p>
      </div>
      <div className={styles.buttonContainer}>
      <Link to={`/details/${movie.id}`}>
        <button onClick={() => {
          setMovieId(movie.id)
        }} className={styles.itemButton}>View Movie</button>
        </Link>
      </div>
    </div>
  )
}
