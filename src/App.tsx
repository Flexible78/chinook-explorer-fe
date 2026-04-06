import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/pages/LoginPage'; // Проверь путь импорта!
import AlbumsPage from './components/pages/AlbumsPage';
function App() {
  return (
      <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
            <Route path="/albums" element={<AlbumsPage />} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
  );
}

export default App;