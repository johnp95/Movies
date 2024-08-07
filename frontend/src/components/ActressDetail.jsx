import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { MovieItem } from "./MovieItem";
import { Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import styles from "./styles/directordetail.module.css";

export const ActressDetail = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const myParam = useParams();
    const actress = myParam.id;
    const url = "http://127.0.0.1:8000/api/movies/actress";

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const res = await fetch(`${url}?actress=${actress}`);
                const data = await res.json();
                setMovies(data);
            } catch (error) {
                console.log("Error fetching data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMovie();
    }, [actress]);

    return (
        <Box className={styles.container}>
            <Typography variant="h3" fontWeight="bold">
                {actress} Movies Seen: {movies.length}
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
