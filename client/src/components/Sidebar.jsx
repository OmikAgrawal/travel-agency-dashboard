import { LayoutDashboard, PlaneTakeoff, Users, Settings, LogOut } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = ({ isOpen, closeSidebar }) => {
    const { logout } = useContext(AuthContext);

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: PlaneTakeoff, label: 'Manage Trips', path: '/trips' },
        { icon: Users, label: 'Customers', active: false },
        { icon: Settings, label: 'Settings', active: false },
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
                            <div
                                key={index}
                                onClick={() => {
                                    // Navigate logic here (we will add React Router Link later)
                                    closeSidebar(); // 3. Closes sidebar after clicking
                                }}
                                className="flex items-center gap-3 p-3 rounded-xl cursor-pointer mb-3 hover:bg-gray-800 text-gray-400 hover:text-white transition-all"
                            >
                                <Icon size={20} />
                                <span className="font-medium">{item.label}</span>
                            </div>
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