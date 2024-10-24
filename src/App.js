import './App.css';
import FinderPage from './pages/find';
import Res from './pages/res';
import { HashRouter, Routes,  Route} from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <HashRouter basename='/'>
        <Routes>
          <Route path="/" element={<FinderPage />} />
          <Route path='/find/:userName' element={<Res />} />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
