// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/pages/LoginPage.js';
import AlbumsPage from './components/pages/AlbumsPage.js';
import ProtectedRoute from './components/ProtectedRoute.js'; // Импорт вышибалы
import PlaylistsPage from './components/pages/PlaylistsPage.js';
function App() {
    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <Routes>
                <Route path="/login" element={<LoginPage />} />

                {/* Все роуты внутри этого блока будут требовать логин */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/albums" element={<AlbumsPage />} />
                    <Route path="/playlists" element={<PlaylistsPage />} />
                </Route>

                <Route path="/" element={<Navigate to="/albums" />} />
            </Routes>
        </div>
    );
}

export default App;