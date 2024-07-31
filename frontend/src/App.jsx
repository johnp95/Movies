import {
    Route,
    createBrowserRouter,
    createRoutesFromElements,
    RouterProvider,
} from "react-router-dom";
import MainLayout from "./Layouts/MainLayout";
import HomePage from "./Pages/HomePage";
import SearchComponent from "./components/SearchComponent";
import AddMovie from "./components/AddMovie";
import NotFoundPage from "./Pages/NotFoundPage";
import BestPicture from "./components/BestPicture";
import MovieDetails from "./components/MovieDetails";
import DirectorDetail from "./components/DirectorDetail";
import ActorDetail from "./components/ActorDetail";
import ActressDetail from "./components/ActressDetail";
import ForeignFilms from "./components/ForeignFilms";
import OldestFilms from "./components/OldestFilms";
import Delete from "./components/Delete";
import Edit, { movieLoader } from "./components/Edit";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="search" element={<SearchComponent />} />
            <Route path="/movie_details/:id" element={<MovieDetails />} />
            <Route path="/actor_detail/:id" element={<ActorDetail />} />
            <Route path="/delete/:id" element={<Delete />} />
            <Route path="/oldest_films" element={<OldestFilms />} />
            <Route path="/actress_detail/:id" element={<ActressDetail />} />
            <Route path="/director_detail/:id" element={<DirectorDetail />} />
            <Route path="/add_movie" element={<AddMovie />} />
            <Route path="/edit/:id" element={<Edit />} loader={movieLoader} />
            <Route path="/best_picture" element={<BestPicture />} />
            <Route path="/foreign-films" element={<ForeignFilms />} />
            <Route path="*" element={<NotFoundPage />} />
        </Route>
    )
);

const App = () => {
    return <RouterProvider router={router} />;
};

export default App;
