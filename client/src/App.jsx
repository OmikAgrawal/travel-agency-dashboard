import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Sidebar from './components/Sidebar';
import { useState } from 'react'; // 1. Add useState
import { Menu, X } from 'lucide-react'; // 2. Add Menu and X icons
import Dashboard from './pages/Dashboard.jsx';
import AITrips from "./pages/AITrips.jsx";
import Customers from './pages/Customers';
import Marketplace from "./pages/Marketplace.jsx";
import UserNavbar from "./components/UserNavbar.jsx";
import MyBookings from "./pages/MyBookings.jsx";
import GrowthAnalysis from "./pages/GrowthAnalysis.jsx";

// A helper component to protect our private pages
const PrivateRoute = ({ children }) => {
    const { isAuthenticated, loading } = useContext(AuthContext);


    // If we are still checking the token, show a blank screen or a spinner
    if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

    return isAuthenticated ? children : <Navigate to="/login" />;
};

const isTokenValid = (token) => {
    if (!token) return false;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        // payload.exp is in seconds, Date.now() is in milliseconds
        return payload.exp * 1000 > Date.now();
    } catch (e) {
        return false;
    }
};

function App() {
    const { isAuthenticated, loading, role } = useContext(AuthContext);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // 3. The "Switch"

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

    return (
        <Router>
            {/* 1. Make the wrapper exactly the screen height and hide its overflow */}
            <div className="flex h-screen w-full bg-gray-100 overflow-hidden">

                {/* The Sidebar */}
                {isAuthenticated && role === "admin" && (
                    <Sidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />
                )}

                {/* The Main Content Area */}
                {/* 2. Make this container scrollable independently */}
                <div className="flex-1 flex flex-col h-full overflow-y-auto relative">

                    {isAuthenticated && role === "user" && (
                        <UserNavbar />
                    )}

                    {/* Mobile Hamburger Button */}
                    {isAuthenticated && role === "admin" && (
                        <button
                            onClick={toggleSidebar}
                            className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-lg shadow-md"
                        >
                            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    )}

                    {/* 3. Page Content */}
                    <main className={`p-8 w-full ${isAuthenticated ? 'pt-20 lg:pt-8' : ''}`}>
                        <Routes>
                            <Route
                                path="/"
                                element={isTokenValid(localStorage.getItem("token")) ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
                            />

                            <Route
                                path="/login"
                                element={!isAuthenticated ? <Login /> : <Navigate to= {role === "admin" ? "/dashboard" : "/marketplace"} />} />

                            <Route
                                path="/dashboard"
                                element={isAuthenticated && role === "admin" ? <Dashboard /> : <Navigate to="/marketplace" />}
                            />

                            <Route path="/dashboard" element={
                                <PrivateRoute>
                                    <Dashboard />
                                </PrivateRoute>
                            } />

                            <Route path="/marketplace" element={
                                <PrivateRoute>
                                    <Marketplace/>
                                </PrivateRoute>
                            } />

                            <Route path="/customers" element={
                                <PrivateRoute>
                                    <Customers />
                                </PrivateRoute>
                            } />

                            <Route path="/AITrips" element={
                                <PrivateRoute>
                                    <AITrips />
                                </PrivateRoute>
                            } />

                            <Route path="/GrowthAnalysis" element={
                                <PrivateRoute>
                                    <GrowthAnalysis />
                                </PrivateRoute>
                            } />

                            <Route
                                path="/my-bookings"
                                element={isAuthenticated && role === 'user' ? <MyBookings /> : <Navigate to="/login" />}
                            />

                            <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
                        </Routes>
                    </main>
                </div>
            </div>
        </Router>
    );
}

export default App;