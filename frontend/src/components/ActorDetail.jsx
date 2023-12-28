import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MovieItem } from './MovieItem';
import { Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import styles from './styles/directordetail.module.css'

export const ActorDetail = () => {

    const [movies, setMovies] = useState([]);
    const [loading,setLoading] = useState(true)
    const myParam = useParams()
    const actor = myParam.id
    const url = 'http://127.0.0.1:8000/api/movies/actor';

    useEffect(() => {
    const fetchMovie = async () => {
      const res = await fetch(`${url}?actor=${actor}`);
      const data = await res.json();
      console.log(data);
      setMovies(data);
      setLoading(false)
    };
    fetchMovie();
  }, []);

  return (
    <Box className={styles.container}>
        <Typography 
            variant='h3' 
            fontWeight='bold'>
            {actor}  Movies Seen: {movies.length}
       </Typography>
        {loading ?
            <Box sx={{ display: 'flex' }}>
                <CircularProgress />
            </Box>
            :
        <div className={styles.cardContainer}>
            {movies.map((movie) => (
                <MovieItem 
                    key={movie.id} 
                    movie={movie} /> 
                ))}
        </div>
        }
   </Box>
   
  );
};
