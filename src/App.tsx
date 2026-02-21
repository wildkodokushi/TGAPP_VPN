import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import MainPage from './pages/Main';
import TariffsPage from './pages/Tarifs';
import CabinetPage from './pages/Cabinet';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<MainPage />} />
          <Route path="/tariffs" element={<TariffsPage />} />
          <Route path="/cabinet" element={<CabinetPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;