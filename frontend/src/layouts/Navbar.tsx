'use client';

import { usePathname } from "next/navigation";
import TaskSearch from "@/components/TaskSearch";
import NavbarActions from "@/components/NavbarActions";
import AccountMenu from "@/components/AccountMenu";

export default function Navbar() {
    const pathname = usePathname();
    const showTaskSearch = (pathname === "/");

    return (
        <>
            <header className="flex h-16 items-center gap-6 border-b border-gray-200 bg-white px-8">
                <h2 className="shrink-0 text-xl font-bold">To Do App</h2>

                {showTaskSearch && <TaskSearch />}

                <div className="ml-auto flex items-center space-x-4">
                    <NavbarActions />
                    <AccountMenu />
                </div>
            </header>
        </>
    );
}
