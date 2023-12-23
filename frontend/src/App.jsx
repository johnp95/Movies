import {Routes, Route} from 'react-router-dom';
import { Home } from './components/Home';
import { About } from './components/About';
import { AddMovie } from './components/AddMovie';
import { Navbar } from './components/Navbar';
import Edit from './components/Edit';
import Delete from './components/Delete';
import { SearchComponent } from './components/SearchComponent';
import {MovieDetails} from './components/MovieDetails';
import { CardContainer } from './components/CardContainer';
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
        <Route path='/details/:id' element={<MovieDetails />} />
      </Routes> 
    </div>
  );
}

export default App;
