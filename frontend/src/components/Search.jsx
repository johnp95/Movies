import React, { useState, useEffect } from 'react';
import styles from './search.module.css';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import MovieIcon from '@mui/icons-material/Movie';
import { Input } from '@mui/material';
const url = 'http://127.0.0.1:8000/api/movies/search';

export const Search = ({ setMovieData, setLoading }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const fetchMovie = async () => {
      const res = await fetch(`${url}?query=${query}`);
      const data = await res.json();
      console.log(data);
      setMovieData(data);
      setLoading(false);
    };
    fetchMovie();
  }, [query]);

  return (
    <div className={styles.searchContainer}>
      <Input
        placeholder="Search Movie"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
        }}
        type="text"
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
