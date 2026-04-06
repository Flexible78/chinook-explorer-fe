import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/pages/LoginPage'; // Проверь путь импорта!

function App() {
  return (
      <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/albums" element={<h2>Секретные альбомы (в разработке)</h2>} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
  );
}

export default App;