import {React,useState,useEffect} from 'react';
import styles from './search.module.css'
const url = 'http://127.0.0.1:8000/api/movies/search'

export const Search = ({ setMovieData, setLoading}) => {
    
    const [query,setQuery] = useState('');

    useEffect(() => {
        const fetchMovie = async () => {
        const res = await fetch(`${url}?query=${query}`);
        const data = await res.json();
        console.log(data)
        setMovieData(data)
        setLoading(false)

        }
        fetchMovie();
        },[query]);

    return (
        <div className={styles.searchContainer}>
        <input 
        className={styles.input}
        placeholder='Search'
        value={query}
        
        onChange={(e) => {
            setQuery(e.target.value)
            setIsClicked(false)
            }}
        type='text'
        />
        </div>
    )
}
