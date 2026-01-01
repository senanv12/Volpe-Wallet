import { Routes, Route } from 'react-router-dom';
import Header from './Components/Header';
import MainPage from './Pages/mainPage';
import AuthPage from './Components/AuthPage';
import ProfilePage from './Pages/ProfilePage'; // Import edin

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<><Header /><MainPage /></>} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/signup" element={<AuthPage mode="signup" />} />
        
        {/* YENİ ROUT */}
        <Route path="/profile" element={<ProfilePage />} />
        
        <Route path="*" element={ <><Header /><MainPage /></> } />
      </Routes>
    </>
  );
}
export default App;