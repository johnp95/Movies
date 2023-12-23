import {React} from 'react'
import { MovieItem } from './MovieItem'

export const MovieList = ({movieData, setMovieId, loading}) => {

    return (
    <div>

       { loading ? <p>Loading data...</p> : 
        movieData.map((movie) => (
        <MovieItem 
        setMovieId={setMovieId} 
        key={movie.id} 
        movie={movie} />
      ))}
    </div>
    )
}
