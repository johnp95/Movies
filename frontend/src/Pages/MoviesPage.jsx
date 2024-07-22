import { AddMovie } from "../components/AddMovie";
import { Edit } from "../components/Edit";
import { Delete } from "../components/Delete";
import { SearchComponent } from "../components/SearchComponent";
import { MovieDetails } from "../components/MovieDetails";
import { BestPicture } from "../components/BestPicture";
import { DirectorDetail } from "../components/DirectorDetail";
import { ActorDetail } from "../components/ActorDetail";
import { ActressDetail } from "../components/ActressDetail";

const MoviesPage = () => {
    return (
        <>
            <AddMovie />
            <Edit />
            <Delete />
            <SearchComponent />
            <MovieDetails />
            <BestPicture />
            <DirectorDetail />
            <ActorDetail />
            <ActressDetail />
        </>
    );
};
export default MoviesPage;
