import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import MainPage from './pages/Main';
import TariffsPage from './pages/Tarifs';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<MainPage />} />
          <Route path="/tariffs" element={<TariffsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;