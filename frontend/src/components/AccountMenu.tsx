import { useAccountMenu } from "@/hooks/useAccountMenu";
import Link from "next/link";

export default function AccountMenu() {
    const {
        session,
        dropdownOpen,
        dropdownRef,
        initials,
        handleToggleDropdown,
        handleCloseDropdown,
        handleSignOut,
    } = useAccountMenu();

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={handleToggleDropdown}
                className="flex h-8 w-8 text-white items-center justify-center rounded-full bg-black text-xs font-bold shadow-sm focus:outline-none focus:ring-2"
            >
                {initials}
            </button>

            {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl border border-gray-100 bg-white p-2 shadow-lg z-50">
                    {session?.user?.name && (
                        <p className="px-4 py-1.5 text-xs text-gray-400 truncate border-b border-gray-100 mb-1">
                            {session.user.name}
                        </p>
                    )}
                    <div className="space-y-1">
                        <Link
                            href="/profile"
                            onClick={handleCloseDropdown}
                            className="block rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            My Profile
                        </Link>
                        <div className="border-t border-gray-100 my-1"></div>
                        <button
                            onClick={handleSignOut}
                            className="w-full text-left rounded-lg px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                            Log Out
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
