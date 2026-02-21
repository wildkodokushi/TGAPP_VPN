import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './pages/Main';
import TariffsPage from './pages/Tarifs';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/tariffs" element={<TariffsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;