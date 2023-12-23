import { React, useState } from 'react'
import { MovieItem } from './MovieItem'
import styles from './cardcontainer.module.css'
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

export const MovieList = ({movieData, setMovieId, loading,currentCards}) => {

 

 

    return (
    <div className={styles.cardContainer}>
       { loading ? <p>Loading data...</p> : 
        currentCards.map((movie) => (
        <MovieItem 
        setMovieId={setMovieId} 
        key={movie.id} 
        movie={movie} />
      ))}
      
    </div>
    
    )
}
