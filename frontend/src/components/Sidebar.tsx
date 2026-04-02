'use client';

import { useRouter, usePathname } from 'next/navigation';
import { LayoutDashboard, UserCircle, ChevronLeft, ChevronRight, CalendarCheck, ClipboardClock, LayoutList } from 'lucide-react';
import { useState } from 'react';

export default function Sidebar() {
    const router = useRouter();
     const pathname = usePathname(); 
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);
    return (
        <aside className={`relative hidden flex-col border-r border-gray-200 bg-white md:flex h-screen top-0 transition-all duration-300
            ${isCollapsed ? 'w-20 p-3' : 'w-64 p-5'}
        `}>
            <button
                    onClick={toggleSidebar}
                className='absolute -right-3 top-10 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 shadow-sm z-10'
            >
                {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14}/>}
            </button>
            <nav className="flex-1 space-y-1 mt-4">
                <button
                    onClick={() => router.push('/')}
                    className={`flex w-full rounded-lg px-4 py-2 text-left font-medium transition-colors
                        ${isCollapsed ? 'justify-center' : "gap-3"}
                        ${pathname === '/' ? 'bg-gray-800 text-white' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                    <LayoutDashboard size={20} />
                    {!isCollapsed && <span className='font-medium'>DashBoard</span>}
                    
                </button>
                
                
                <button
                    onClick={() => router.push('/category')}
                    className={`flex w-full  rounded-lg  px-4 py-2 text-left font-medium transition-colors 
                        ${isCollapsed ? 'justify-center' : "gap-3"}
                        ${pathname ===  '/category' ? 'bg-gray-800 text-white' : 'text-gray-600 hover:bg-gray-100'
                            }`}
                >
                    <LayoutList size={20} />
                    {!isCollapsed && <span className=' font-medium'>Category</span>}
                    
                </button>

                               
                <button
                    onClick={() => router.push('/profile')}
                    className={`flex w-full rounded-lg px-4 py-2 text-left font-medium transition-colors 
                        ${isCollapsed ? 'justify-center' : "gap-3"}
                        ${pathname === '/profile' ? 'bg-gray-800 text-white' : 'text-gray-600 hover:bg-gray-100'
                        }`}
                >
                    <UserCircle size={20} />
                    {!isCollapsed && <span className='font-medium'>Profile</span>}
                    
                </button>

            </nav>
        </aside>
    );
}