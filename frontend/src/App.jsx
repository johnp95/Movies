import {Routes, Route} from 'react-router-dom';
import { Home } from './components/Home';
import { About } from './components/About';
import { AddMovie } from './components/AddMovie';
import { Navbar } from './components/Navbar';
import Edit from './components/Edit';
import Delete from './components/Delete';
import { SearchComponent } from './components/SearchComponent';
import {MovieDetails} from './components/MovieDetails';
import { BestPicture } from './components/BestPicture';

function App() {
  
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/about" element={<About />}/>
        <Route path="/search" element={<SearchComponent />}/>
        <Route path="/AddMovie" element={<AddMovie />}/>
        <Route path='/edit/:id' element={<Edit />}  />
        <Route path='/delete/:id' element={<Delete />} />
        <Route path='/movie_details/:id' element={<MovieDetails />} />
        <Route path='/best_picture' element={<BestPicture />} />
      </Routes> 
    </div>
  );
}

export default App;
