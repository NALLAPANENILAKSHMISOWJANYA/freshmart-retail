

import { Home, Search, Map as MapIcon, User, MessageCircle } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const BottomNav = () => {
    const navItems = [
        { icon: Home, label: 'Home', path: '/home' },
        { icon: Search, label: 'Search', path: '/search' },
        { icon: MessageCircle, label: 'Chat', path: '/chat' },
        { icon: MapIcon, label: 'Map', path: '/navigate/demo' }, // Placeholder for general map
        // { icon: User, label: 'Profile', path: '/profile' },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-3 pb-safe">
            <nav className="mx-auto max-w-sm">
                <div className="flex items-center justify-around p-2.5 rounded-full shadow-lg border border-gray-200/80 backdrop-blur-md bg-white/95">
                    {navItems.map(({ icon: Icon, label, path }) => (
                        <NavLink
                            key={path}
                            to={path}
                            className={({ isActive }) =>
                                `relative flex flex-col items-center justify-center p-3 rounded-full transition-all duration-300 group
                ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary'}
                `
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <div className={`
                    absolute inset-0 rounded-full transition-all duration-300
                    ${isActive ? 'bg-primary/10 scale-100' : 'scale-0 group-hover:scale-90 group-hover:bg-primary/5'}
                  `} />

                                    <div className="relative z-10 flex flex-col items-center">
                                        <Icon
                                            size={24}
                                            className={`transition-all duration-300 ${isActive ? 'scale-110 -translate-y-1' : 'group-hover:scale-105'
                                                }`}
                                            strokeWidth={isActive ? 2.5 : 2}
                                        />
                                        <span
                                            className={`
                        text-[10px] font-bold mt-1 transition-all duration-300 absolute -bottom-2
                        ${isActive
                                                    ? 'opacity-100 translate-y-0 scale-100'
                                                    : 'opacity-0 translate-y-2 scale-75'}
                      `}
                                        >
                                            {label}
                                        </span>
                                    </div>

                                    {isActive && (
                                        <div className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full animate-pulse" />
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}
                </div>
            </nav>
        </div>
    );
};

export default BottomNav;
