import {Routes,Route} from 'react-router-dom';
import { Home } from './components/Home';
import { About } from './components/About';
import { AddMovie } from './components/AddMovie';
import { Navbar } from './components/Navbar';
import Edit from './components/Edit';
import Delete from './components/Delete';
import {Search} from './components/Search';
import {useState} from 'react';
import { MovieList } from './components/MovieList';
import {Container} from './components/Container';
import { InnerContainer } from './components/InnerContainer';
import {MovieDetails} from './components/MovieDetails';

function App() {

  const [movieData, setMovieData] = useState([])
  const [movieId, setMovieId] = useState('')
  const [isClicked,setIsClicked] = useState(false)

  
  return (
    <div className="App">
      <Navbar />
      <Search setMovieData={setMovieData} setIsClicked={setIsClicked} />
      <Container>
        <InnerContainer>
          <MovieList setMovieId={setMovieId} movieData={movieData} setIsClicked={setIsClicked}/>
        </InnerContainer>
        <InnerContainer>
          <MovieDetails movieId={movieId} isClicked={isClicked}/>
        </InnerContainer>
      </Container>
      
      

      {/* <Routes>
        <Route path="" element={<Home />}/>
        <Route path="/about" element={<About />}/>
        <Route path="/AddMovie" element={<AddMovie />}/>
        <Route path='/edit/:id' element={<Edit />}  />
        <Route path='/delete/:id' element={<Delete />} />
      </Routes> */}
    

    </div>
  );
}

export default App;
