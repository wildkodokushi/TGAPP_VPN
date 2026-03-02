import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import MainPage from './pages/Main';
import SubscriptionPage from './pages/Subscription';
import ReferralsPage from './pages/Referrals';
import SupportPage from './pages/Support';
import ProfilePage from './pages/Profile';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<MainPage />} />
          <Route path="/subscription" element={<SubscriptionPage />} />
          <Route path="/referrals" element={<ReferralsPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
