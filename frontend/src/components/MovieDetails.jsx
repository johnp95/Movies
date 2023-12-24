import {React, useEffect, useState} from 'react'
import {useParams} from 'react-router-dom';
import styles from './moviedetails.module.css';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import {Link} from 'react-router-dom';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';

export const MovieDetails = () => {
    const [movie, setMovie] = useState('');
    const MyParam = useParams()
    const myId = MyParam.id
    const url = `http://127.0.0.1:8000/api/movies/${myId}`;

    useEffect(() => {
        const fetchMovie = async () => {
            const res = await fetch(`${url}`);
            const data = await res.json();
            console.log(data)
            setMovie(data)
        }
        fetchMovie();
    },[] )
  
  return (
    <Card className={styles.movieCard}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="auto"
          image={movie.image}
          alt=""
        />
        <CardContent>
          <Typography gutterBottom variant="h4" component="div">
            {movie.title}
          </Typography>
          <Typography fontWeight='bold' variant="body2" color="text.secondary">
          Director: {movie.director}
          </Typography>
          <Typography fontWeight='bold' variant="body2" color="text.secondary">
          Actor: {movie.actor ? movie.actor : ''}
          </Typography>
          <Typography fontWeight='bold' variant="body2" color="text.secondary">
          Actress: {movie.actress ? movie.actress : ''}
          </Typography>
          <Typography fontWeight='bold' variant="body2" color="text.secondary">
          Date Watched: {movie.date_watched}
          </Typography>
          <Typography fontWeight='bold' variant="body2" color="text.secondary">
          Released: {movie.released}
          </Typography>
          <Typography fontWeight='bold' variant="body2" color="text.secondary">
          {movie.best_picture ? <Alert severity="info">Best Picture Winner</Alert> : ''}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions className={styles.buttonContainer}>
      
      <Link to={`/search/`}>
        <Tooltip title="Go back to Movies">
        <KeyboardReturnIcon style={{ cursor: 'pointer' }} />
      </Tooltip>
        </Link>
      </CardActions>
    </Card>
    // <div>
    //     <div className={styles.movieCard}>
    //         <h1 className={styles.movieName}>
    //             {movie.title}
    //         </h1>
    //         <img className={styles.movieImage} src={movie.image} alt='' />
    //         <div className={styles.movieDetails}>
    //             <span><strong>Director: {movie.director}</strong></span>
    //             <span>{movie.best_picture ? "Best Picture Winner" : ""}</span>
    //         </div>
    //         <div className={styles.movieActors}>
    //             <strong>Actors: </strong> 
    //             <span><strong>{movie.actor}, </strong></span>
    //             <span><strong>{movie.actress}</strong></span>
    //         </div>
    //         <div className={styles.movieData}>
    //             <strong>Date Watched: </strong>
    //             <span><strong>{movie.date_watched}</strong></span>
    //         </div>
    //         <div className={styles.movieData}>
    //             <strong>Released: </strong>
    //             <span><strong>{movie.released}</strong></span>
    //         </div>
    //     </div>
    // </div>
  )
}
