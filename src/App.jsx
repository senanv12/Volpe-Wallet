import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './Components/Header';
import MainPage from './Pages/mainPage';
import AuthPage from './Components/AuthPage';
import ProfilePage from './Pages/ProfilePage';
// import ChatWidget from './Components/ChatWidget';
import { useData } from './Context/DataContext';

function App() {
  const { user } = useData();

  const isAuthPage = window.location.pathname.includes('/login') || window.location.pathname.includes('/signup');

  return (
    <>
      {user && !isAuthPage && <Header />}

      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <AuthPage mode="login" />} />
        <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <AuthPage mode="signup" />} />
        
        <Route path="/dashboard" element={user ? <MainPage /> : <Navigate to="/login" />} />
        <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/login" />} />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {user && !isAuthPage}
    </>
  );
}

export default App;