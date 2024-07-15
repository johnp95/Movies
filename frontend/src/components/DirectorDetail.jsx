import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { MovieItem } from "./MovieItem";
import { Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

import Box from "@mui/material/Box";
import styles from "./styles/directordetail.module.css";

export const DirectorDetail = () => {
    const [movies, setMovies] = useState([]);
    const myParam = useParams();
    const [loading, setLoading] = useState(true);

    const myDirector = myParam.id;
    const url = "http://127.0.0.1:8000/api/movies/director";

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const res = await fetch(`${url}?director=${myDirector}`);
                const data = await res.json();
                setMovies(data);
            } catch (error) {
                console.log("Error fetching data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMovie();
    }, [myDirector]);

    return (
        <Box className={styles.container}>
            <Typography variant="h3" fontWeight="bold">
                {myDirector} Movies Seen: {movies.length}
            </Typography>
            {loading ? (
                <Box sx={{ display: "flex" }}>
                    <CircularProgress />
                </Box>
            ) : (
                <div className={styles.cardContainer}>
                    {movies.map((movie) => (
                        <MovieItem key={movie.id} movie={movie} />
                    ))}
                </div>
            )}
        </Box>
    );
};
