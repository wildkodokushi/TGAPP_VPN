import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import MainPage from './pages/Main';
import TariffsPage from './pages/Tarifs';
import CabinetPage from './pages/Cabinet';
import ConnectPage from './pages/Connect';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<MainPage />} />
          <Route path="/connect" element={<ConnectPage />} />
          <Route path="/tariffs" element={<TariffsPage />} />
          <Route path="/cabinet" element={<CabinetPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
