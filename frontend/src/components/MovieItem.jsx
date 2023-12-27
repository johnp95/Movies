import { React } from 'react';
import { Link } from 'react-router-dom'
import Button from '@mui/material/Button';
import styles from './styles/movieitem.module.css';

export const MovieItem = ({movie, setMovieId}) => {

  return (
    <div className={styles.itemContainer}>
      <img className={styles.itemImage} src={movie.image} alt='' />
      <div className={styles.itemContent}>
        <p className={styles.itemName}>{movie.title}</p>
      </div>
      <div className={styles.buttonContainer}>
        <Link to={`/movie_details/${movie.id}`}>
          <Button onClick={() => {
            setMovieId(movie.id)
          }} 
          style={{backgroundColor:'#000d33', color:'white'}}
          size='large'
          variant='outlined'
          className={styles.itemButton}>View Movie
          </Button>
          </Link>
      </div>
    </div>
  )
}
