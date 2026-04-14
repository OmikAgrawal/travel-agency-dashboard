import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Sidebar from './components/Sidebar';
import { useState } from 'react'; // 1. Add useState
import { Menu, X } from 'lucide-react'; // 2. Add Menu and X icons
import Dashboard from './pages/Dashboard.jsx';
import AITrips from "./pages/AITrips.jsx";

// A helper component to protect our private pages
const PrivateRoute = ({ children }) => {
    const { isAuthenticated, loading } = useContext(AuthContext);


    // If we are still checking the token, show a blank screen or a spinner
    if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

    return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
    const { isAuthenticated, loading } = useContext(AuthContext);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // 3. The "Switch"

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

    return (
        <Router>
            <div className="flex min-h-screen bg-gray-100 w-full">

                {/* The Sidebar (Always takes its 64px width on Large screens) */}
                {isAuthenticated && (
                    <Sidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />
                )}

                {/* The Main Content Area */}
                <div className="flex-1 w-full relative">

                    {/* Hamburger Button: Moved slightly for better spacing */}
                    {isAuthenticated && (
                        <button
                            onClick={toggleSidebar}
                            className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-lg shadow-md"
                        >
                            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    )}

                    {/* Page Content: Added pt-20 (padding-top) for mobile to clear the button */}
                    <main className={`p-8 ${isAuthenticated ? 'pt-20 lg:pt-8' : ''}`}>
                        <Routes>
                            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />

                            {/* All Protected Routes go inside here */}
                            <Route path="/dashboard" element={
                                <PrivateRoute>
                                    <Dashboard />
                                </PrivateRoute>
                            } />

                            <Route path="/AITrips" element={
                                <PrivateRoute>
                                    <AITrips />
                                </PrivateRoute>
                            } />



                            {/*<Route path="/trips" element={*/}
                            {/*    <PrivateRoute>*/}
                            {/*        <Dashboard />*/}
                            {/*    </PrivateRoute>*/}
                            {/*} />*/}

                            {/* Default redirect */}
                            <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
                        </Routes>
                    </main>
                </div>
            </div>
        </Router>
    );
}

export default App;