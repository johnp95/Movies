import './App.css';
import {Routes,Route} from 'react-router-dom';
import { Home } from './components/Home';
import { About } from './components/About';
import { AddMovie } from './components/AddMovie';
import { Navbar } from './components/Navbar';
import { Navbar2 } from './components/Navbar2';
import Edit from './components/Edit';
import Delete from './components/Delete';
function App() {
  return (
    <div className="App">
      {/* <Navbar /> */}
      <Navbar2 />
      <Routes>
        <Route path="" element={<Home />}/>
        <Route path="/about" element={<About />}/>
        <Route path="/AddMovie" element={<AddMovie />}/>
        <Route path='/edit/:id' element={<Edit />}  />
        <Route path='/delete/:id' element={<Delete />} />
      </Routes>
   

    </div>
  );
}

export default App;
