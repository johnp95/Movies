import Search from "./Search";
import { useState } from "react";
import MovieList from "./MovieList";
import Container from "./Container";
import InnerContainer from "./InnerContainer";
import Pagination from "@mui/material/Pagination";

const SearchComponent = () => {
    const [movieData, setMovieData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const cardsPerPage = 10;
    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };
    const startIndex = (currentPage - 1) * cardsPerPage;
    const endIndex = startIndex + cardsPerPage;
    const currentCards = movieData.slice(startIndex, endIndex);

    return (
        <div>
            <Search setMovieData={setMovieData} setLoading={setLoading} />
            <Container>
                <InnerContainer>
                    <MovieList loading={loading} movies={currentCards} />
                </InnerContainer>
            </Container>
            <div className="flex items-center justify-center m-0">
                <Pagination
                    size="large"
                    count={Math.ceil(movieData.length / cardsPerPage)}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                />
            </div>
        </div>
    );
};

export default SearchComponent;
