import {React} from 'react'
import { MovieItem } from './MovieItem'

export const MovieList = ({movieData, setMovieId, setIsClicked}) => {

    return (
    <div>
       {movieData.map((movie) => (
        <MovieItem 
        setMovieId={setMovieId} 
        setIsClicked={setIsClicked}
        key={movie.id} 
        movie={movie} />
      ))}
    </div>
    )
}
