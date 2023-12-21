import {React} from 'react'
import { MovieItem } from './MovieItem'

export const MovieList = ({movieData}) => {

    return (
    <div>
       {movieData.map((movie) => (
       <MovieItem key={movie.id} movie={movie} />
      ))}
    </div>
    )
}
