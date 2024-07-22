import { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import MovieIcon from "@mui/icons-material/Movie";
import { Input } from "@mui/material";
import styles from "./styles/search.module.css";

const url = "http://127.0.0.1:8000/api/movies/search";

export const Search = ({ setMovieData, setLoading }) => {
    const [query, setQuery] = useState("");
    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const res = await fetch(`${url}?query=${query}`);
                const data = await res.json();
                setMovieData(data);
            } catch (error) {
                console.log("Error fetching data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMovie();
    }, [query, setLoading, setMovieData]);

    return (
        <div className={styles.searchContainer}>
            <Input
                placeholder="Movie, Director, or Actor"
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                }}
                type="text"
                id="searchInput"
                classes={{ input: styles.inputPlaceholder }}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton>
                            <MovieIcon />
                        </IconButton>
                    </InputAdornment>
                }
            />
        </div>
    );
};
