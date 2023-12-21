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
    const [isClicked,setIsClicked] = useState(false)
  
  return (
    <div>
        <Search setMovieData={setMovieData} setIsClicked={setIsClicked} />
      <Container>
        <InnerContainer>
          <MovieList setMovieId={setMovieId} movieData={movieData} setIsClicked={setIsClicked}/>
        </InnerContainer>
        <InnerContainer>
          <MovieDetails movieId={movieId} isClicked={isClicked}/>
        </InnerContainer>
      </Container>
      
    </div>
  )
}
