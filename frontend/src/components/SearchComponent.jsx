import React from 'react'
import { Search } from './Search'
import {useState} from 'react';
import { MovieList } from './MovieList';
import {Container} from './Container';
import { InnerContainer } from './InnerContainer';
import {MovieDetails} from './MovieDetails';

export const SearchComponent = () => {
    const [movieData, setMovieData] = useState([])
    const [movieId, setMovieId] = useState('')
    const [loading,setLoading] = useState(true)
  
  return (
    <div>
        <Search setMovieData={setMovieData} setLoading={setLoading} />
      <Container>
        <InnerContainer>
          <MovieList 
           setMovieId={setMovieId}
           movieData={movieData}
           loading={loading}
           />
        </InnerContainer>
      </Container>
      
    </div>
  )
}
