import { LayoutDashboard, PlaneTakeoff, Users, Settings, LogOut } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, closeSidebar }) => {
    const { logout } = useContext(AuthContext);
    const location = useLocation();

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: Users, label: 'Customers', path: '/customers' },
        { icon: PlaneTakeoff, label: 'AI Trips', path: '/AITrips' },
    ];

    return (
        <>
            {/* 1. Dark Overlay (Closes sidebar when you click outside it) */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={closeSidebar}
                ></div>
            )}

            {/* 2. The Sliding Sidebar */}
            <div className={`
        fixed lg:static inset-y-0 left-0 z-40 w-64 bg-gray-900 text-white flex flex-col p-6 
        transition-transform duration-300 ease-in-out transform
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
                <div className="flex items-center gap-3 mb-10">
                    <PlaneTakeoff size={24} className="text-blue-500" />
                    <h2 className="text-2xl font-bold">TravelPro</h2>
                </div>

                <nav className="flex-1">
                    {menuItems.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                to={item.path}
                                key={index}
                                onClick={closeSidebar}
                                className={`flex items-center gap-3 p-3 rounded-xl mb-3 transition-all ${
                                    location.pathname === item.path
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                                        : 'hover:bg-gray-800 text-gray-400 hover:text-white'
                                }`}
                            >
                                <Icon size={20} />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <button
                    onClick={logout}
                    className="mt-auto flex items-center gap-3 p-3 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                >
                    <LogOut size={20}/>
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </>
    );
};

export default Sidebar;