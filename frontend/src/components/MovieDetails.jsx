import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActions, Button } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import Alert from "@mui/material/Alert";
import { Link } from "react-router-dom";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import styles from "./styles/moviedetails.module.css";

export const MovieDetails = () => {
    const [movie, setMovie] = useState(null);
    const [watchCount, setWatchCount] = useState(0);
    const MyParam = useParams();
    const myId = MyParam.id;
    const url = `http://127.0.0.1:8000/api/movies/${myId}`;
    const allMoviesUrl = `http://127.0.0.1:8000/api/movies/`;

    useEffect(() => {
        const fetchMovie = async () => {
            const res = await fetch(url);
            const data = await res.json();
            setMovie(data);

            const allMoviesRes = await fetch(allMoviesUrl);
            const allMoviesData = await allMoviesRes.json();

            const count = allMoviesData.filter(
                (m) => m.title === data.title
            ).length;
            setWatchCount(count);
        };
        fetchMovie();
    }, [url, allMoviesUrl]);

    if (!movie) {
        return <div>Loading...</div>;
    }

    return (
        <Card className={styles.movieCard}>
            <div className={styles.cardContent}>
                <div className={styles.leftColumn}>
                    <Typography
                        gutterBottom
                        variant="h6"
                        className={styles.movieData}
                    >
                        Director:{" "}
                        <Link
                            to={`/director_detail/${movie.director}`}
                            rel="noopener noreferrer"
                            className={styles.link}
                        >
                            {movie.director}
                        </Link>
                    </Typography>

                    <Typography
                        gutterBottom
                        variant="h6"
                        className={styles.movieActors}
                    >
                        Actor:{" "}
                        {movie.actor ? (
                            <Link
                                to={`/actor_detail/${movie.actor}`}
                                rel="noopener noreferrer"
                                className={styles.link}
                            >
                                {movie.actor}
                            </Link>
                        ) : (
                            "N/A"
                        )}
                    </Typography>

                    <Typography
                        gutterBottom
                        variant="h6"
                        className={styles.movieActors}
                    >
                        Actress:{" "}
                        {movie.actress ? (
                            <Link
                                to={`/actress_detail/${movie.actress}`}
                                rel="noopener noreferrer"
                                className={styles.link}
                            >
                                {movie.actress}
                            </Link>
                        ) : (
                            "N/A"
                        )}
                    </Typography>
                </div>

                <CardMedia
                    component="img"
                    image={movie.image}
                    alt={movie.title}
                    className={styles.movieImage}
                    onClick={() =>
                        window.open(
                            `https://en.wikipedia.org/wiki/${movie.title}`,
                            "_blank"
                        )
                    }
                    style={{ cursor: "pointer" }}
                />

                <div className={styles.rightColumn}>
                    <Typography
                        gutterBottom
                        variant="body1"
                        className={styles.movieDetails}
                    >
                        Date Watched: {movie.date_watched}
                    </Typography>

                    <Typography
                        gutterBottom
                        variant="body1"
                        className={styles.movieDetails}
                    >
                        Released: {movie.released}
                    </Typography>

                    <Typography
                        gutterBottom
                        variant="body1"
                        className={styles.movieDetails}
                    >
                        Times Watched: {watchCount}
                    </Typography>

                    {movie.best_picture && (
                        <Alert severity="info" className={styles.alert}>
                            Best Picture Winner
                        </Alert>
                    )}
                </div>
            </div>

            <CardActions className={styles.buttonContainer}>
                <Link to={`/search/`}>
                    <Tooltip title="Go back to Movies">
                        <Button
                            className={styles.itemButton}
                            startIcon={<KeyboardReturnIcon />}
                        >
                            Go Back
                        </Button>
                    </Tooltip>
                </Link>
            </CardActions>
        </Card>
    );
};
