import {React, useEffect, useState } from 'react';
import styles from './moviedetails.module.css';

export const MovieDetails = ({movieId, isClicked}) => {

    const [movie, setMovie] = useState('');
    const url = `http://127.0.0.1:8000/api/movies/${movieId}`;

    useEffect(() => {
        const fetchMovie = async () => {
            const res = await fetch(`${url}`);
            const data = await res.json();
            console.log(data);
            setMovie(data);
        }
        fetchMovie();
    },[movieId])

    return (
        <div>
            {
            !isClicked ? <p></p> :
            <div className={styles.movieCard}>
                <h1 className={styles.movieName}>
                    {movie.title}
                </h1>
                <img className={styles.movieImage} src={movie.image} alt='' />
                <div className={styles.movieDetails}>
                    <span><strong>Director: {movie.director}</strong></span>
                    <span>{movie.best_picture ? "Best Picture Winner" : ""}</span>
                </div>
                <div className={styles.movieActors}>
                    <strong>Actors: </strong> 
                    <span><strong>{movie.actor}, </strong></span>
                    <span><strong>{movie.actress}</strong></span>
                </div>
                <div className={styles.movieData}>
                    <strong>Date Watched: </strong>
                    <span><strong>{movie.date_watched}</strong></span>
                </div>
                <div className={styles.movieData}>
                    <strong>Released: </strong>
                    <span><strong>{movie.released}</strong></span>
                </div>
            </div>
            }
        </div>

    )
}
