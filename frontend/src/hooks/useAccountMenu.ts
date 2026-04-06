import { useEffect, useRef, useState } from "react";
import { signOut, useSession } from "next-auth/react";

export function useAccountMenu() {
    const { data: session } = useSession();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const initials = (() => {
        const name = session?.user?.name ?? session?.user?.email ?? "";
        const parts = name.trim().split(/\s+/);
        if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        return name.slice(0, 2).toUpperCase() || "?";
    })();

    const handleToggleDropdown = () => {
        setDropdownOpen((prev) => !prev);
    };

    const handleCloseDropdown = () => {
        setDropdownOpen(false);
    };

    const handleSignOut = () => {
        signOut({ callbackUrl: "/login" });
    };

    return {
        session,
        dropdownOpen,
        dropdownRef,
        initials,
        handleToggleDropdown,
        handleCloseDropdown,
        handleSignOut,
    };
}
