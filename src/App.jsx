import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './Components/Header';
import MainPage from './Pages/mainPage';
import AuthPage from './Components/AuthPage';
import ProfilePage from './Pages/ProfilePage';
import ChatWidget from './Components/ChatWidget'; // <--- 1. IMPORT ET

function App() {
  const location = useLocation();
  
  // Login və Signup səhifələrində çatı gizlətmək üçün (istəsəniz qala da bilər)
  const hideChat = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <>
      <Routes>
        <Route path="/" element={<><Header /><MainPage /></>} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/signup" element={<AuthPage mode="signup" />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={ <><Header /><MainPage /></> } />
      </Routes>

      {/* 2. KOMPONENTİ BURA QOYURUQ (Bütün səhifələrdə görünməsi üçün) */}
      {!hideChat && <ChatWidget />} 
    </>
  );
}

export default App;