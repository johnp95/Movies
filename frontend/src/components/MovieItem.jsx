import {React} from 'react';
import styles from './movieitem.module.css';
import {Link} from 'react-router-dom'
import Button from '@mui/material/Button';

export const MovieItem = ({movie, setMovieId}) => {

  return (
    <div className={styles.itemContainer}>
      <img className={styles.itemImage} src={movie.image} alt='' />
      <div className={styles.itemContent}>
        <p className={styles.itemName}>{movie.title}</p>
      </div>
      <div className={styles.buttonContainer}>
      <Link to={`/details/${movie.id}`}>
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
