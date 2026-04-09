import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/pages/LoginPage.js';
import AlbumsPage from './components/pages/AlbumsPage.js';
import ProtectedRoute from './components/ProtectedRoute.js';
import PlaylistsPage from './components/pages/PlaylistsPage.js';
import CustomersPage from './components/pages/CustomersPage.js';
function App() {
    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <Routes>
                <Route path="/login" element={<LoginPage />} />

                {/* All routes inside this block require authentication */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/albums" element={<AlbumsPage />} />
                    <Route path="/playlists" element={<PlaylistsPage />} />
                    <Route path="/customers" element={<CustomersPage />} />
                </Route>

                <Route path="/" element={<Navigate to="/albums" />} />
            </Routes>
        </div>
    );
}

export default App;
