import React from 'react'
import { Search } from './Search'
import {useState} from 'react';
import { MovieList } from './MovieList';
import {Container} from './Container';
import { InnerContainer } from './InnerContainer';
import Pagination from '@mui/material/Pagination';
import styles from './page.module.css';

export const SearchComponent = () => {

    const [movieData, setMovieData] = useState([])
    const [movieId, setMovieId] = useState('')
    const [loading,setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1);
    const cardsPerPage = 10; 
    const handlePageChange = (event, value) => {
      setCurrentPage(value);
    };
    const startIndex = (currentPage - 1) * cardsPerPage;
    const endIndex = startIndex + cardsPerPage;
    const currentCards = movieData.slice(startIndex, endIndex);
  
  return (
    <div>
      <Search setMovieData={setMovieData} setLoading={setLoading} />
        <Container>
          <InnerContainer>
            <MovieList 
            setMovieId={setMovieId}
            movieData={movieData}
            loading={loading}
            currentCards={currentCards}
            />
          </InnerContainer>
       </Container>
      <div className={styles.paginationContainer}>
        <Pagination 
        size='large'
        count={Math.ceil(movieData.length / cardsPerPage)}
        page={currentPage}
        onChange={handlePageChange}
        color="primary" 
        />
      </div>
    </div>
  )
}
