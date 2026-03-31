import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Sidebar from './components/Sidebar';

// A helper component to protect our private pages
const PrivateRoute = ({ children }) => {
    const { isAuthenticated, loading } = useContext(AuthContext);

    // If we are still checking the token, show a blank screen or a spinner
    if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

    return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
    const { isAuthenticated } = useContext(AuthContext);

    return (
        <Router>
            <div className="flex">
                {/* Only show the Sidebar if the user is logged in */}
                {isAuthenticated && <Sidebar />}

                <div className="flex-1 bg-gray-100 min-h-screen">
                    <Routes>
                        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />

                        {/* All Protected Routes go inside here */}
                        <Route path="/dashboard" element={
                            <PrivateRoute>
                                <div className="p-8">
                                    <h1 className="text-3xl font-bold text-gray-800">Welcome to your Dashboard!</h1>
                                    <p className="text-gray-600">This page is only visible because you are logged in.</p>
                                </div>
                            </PrivateRoute>
                        } />

                        {/* Default redirect */}
                        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;