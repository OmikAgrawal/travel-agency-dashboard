import { LayoutDashboard, PlaneTakeoff, Users, Settings, LogOut } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
    const { logout } = useContext(AuthContext);

    // CRITICAL: menuItems must be INSIDE the component function
    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', active: true },
        { icon: PlaneTakeoff, label: 'Manage Trips', active: false },
        { icon: Users, label: 'Customers', active: false },
        { icon: Settings, label: 'Settings', active: false },
    ];

    return (
        <div className="w-64 h-screen bg-gray-900 text-white flex flex-col p-6 sticky top-0">
            <div className="flex items-center gap-3 mb-10">
                <div className="bg-blue-600 p-2 rounded-lg">
                    <PlaneTakeoff size={24} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">TravelPro</h2>
            </div>

            <nav className="flex-1">
                {menuItems.map((item, index) => {
                    // We call the icon as a Component here: <item.icon />
                    const Icon = item.icon;
                    return (
                        <div
                            key={index}
                            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer mb-3 transition-all duration-200 ${
                                item.active ? 'bg-blue-600 shadow-lg shadow-blue-900/20' : 'hover:bg-gray-800 text-gray-400 hover:text-white'
                            }`}
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
    );
};

export default Sidebar;