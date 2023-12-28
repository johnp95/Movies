import { React, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, CardActions } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import Alert from '@mui/material/Alert';
import { Link } from 'react-router-dom';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import styles from './styles/moviedetails.module.css';

export const MovieDetails = () => {
  
    const [movie, setMovie] = useState('');
    const MyParam = useParams();
    const myId = MyParam.id;
    const url = `http://127.0.0.1:8000/api/movies/${myId}`;

    useEffect(() => {
        const fetchMovie = async () => {
            const res = await fetch(`${url}`);
            const data = await res.json();
            console.log(data);
            setMovie(data);
        }
        fetchMovie();
    },[] )
  
  return (
    <Card className={styles.movieCard}>
    <Typography 
            gutterBottom 
            variant="h5" 
            component="div"
            fontWeight='bold'
            >
            <Link
              to={`https://en.wikipedia.org/wiki/${movie.title}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              {movie.title}
            </Link>
          </Typography>
      <CardActionArea>
      
        <CardMedia
          component="img"
          height="auto"
          image={movie.image}
          alt=""
        />
        <CardContent>
 
          <Typography 
          gutterBottom 
          fontWeight='bold' 
          variant="body2" 
          >
          Director:{' '}
            <Link
              to={`/director_detail/${movie.director}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              {movie.director}
            </Link>
          </Typography>

          <Typography 
            gutterBottom
            fontWeight='bold' 
            variant="body2" 
            >
             Actor:{' '}
            {movie.actor ? (
              <Link
                to={`/actor_detail/${movie.actor}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                {movie.actor}
              </Link>
            ) : (
              ''
            )}
          </Typography>

          <Typography 
            gutterBottom
            fontWeight='bold' 
            variant="body2" 
            >
            Actress:{' '}
            {movie.actress ? (
              <Link
                to={`/actress_detail/${movie.actress}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                {movie.actress}
              </Link>
            ) : (
              ''
            )}
          </Typography>

          <Typography 
            gutterBottom
            fontWeight='bold' 
            variant="body2" 
            >
            Date Watched: {movie.date_watched}
          </Typography>

          <Typography 
            gutterBottom
            fontWeight='bold' 
            variant="body2" 
            >
            Released: {movie.released}
          </Typography>

          <Typography 
            fontWeight='bold' 
            variant="body2" 
            color="text.secondary">
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
    
  )
}
