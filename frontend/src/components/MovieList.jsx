import { React, useState } from 'react'
import { MovieItem } from './MovieItem'
import styles from './cardcontainer.module.css'
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';
import pStyles from './page.module.css';
export const MovieList = ({movies, setMovieId, loading}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 10; 
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  const startIndex = (currentPage - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;
  const currentCards = movies.slice(startIndex, endIndex);
    return (
    <div className={styles.cardContainer}>
       { loading ? 
      <Box sx={{ display: 'flex' }}>
        <CircularProgress />
      </Box> : 
        currentCards.map((movie) => (
        <MovieItem 
        setMovieId={setMovieId} 
        key={movie.id} 
        movie={movie} />
      ))}
      <div className={pStyles.paginationContainer}>
        <Pagination 
        size='large'
        count={Math.ceil(movies.length / cardsPerPage)}
        page={currentPage}
        onChange={handlePageChange}
        color="primary" 
        />
        </div>
    </div>
    
    )
}
