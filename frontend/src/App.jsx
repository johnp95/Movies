import {Routes, Route} from 'react-router-dom';
import { Home } from './components/Home';
import { AddMovie } from './components/AddMovie';
import { Navbar } from './components/Navbar';
import Edit from './components/Edit';
import Delete from './components/Delete';
import { SearchComponent } from './components/SearchComponent';
import { MovieDetails } from './components/MovieDetails';
import { BestPicture } from './components/BestPicture';
import { DirectorDetail } from './components/DirectorDetail';

function App() {
  
  return (

    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/search" element={<SearchComponent />}/>
        <Route path="/add_movie" element={<AddMovie />}/>
        <Route path='/edit/:id' element={<Edit />}  />
        <Route path='/delete/:id' element={<Delete />} />
        <Route path='/movie_details/:id' element={<MovieDetails />} />
        <Route path='/director_detail/:id' element={<DirectorDetail />} />
        <Route path='/best_picture' element={<BestPicture />} />
      </Routes> 
    </div>

  );
}

export default App;
