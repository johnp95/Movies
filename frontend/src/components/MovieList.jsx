import { React, useState } from 'react'
import { MovieItem } from './MovieItem'
import styles from './cardcontainer.module.css'
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
export const MovieList = ({movieData, setMovieId, loading,currentCards}) => {


    return (
    <div className={styles.cardContainer}>
       { loading ? 
        <Box sx={{ display: 'flex' }}>
          <CircularProgress />
        </Box>
        : 
        currentCards.map((movie) => (
        <MovieItem 
        setMovieId={setMovieId} 
        key={movie.id} 
        movie={movie} />
      ))}
      
    </div>
    
    )
}
