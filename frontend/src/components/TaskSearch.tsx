import { Search, X } from "lucide-react";

type TaskSearchProps = {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClear: () => void;
}
export default function TaskSearch({ value, onChange, onClear }: TaskSearchProps) {
    return (
        <div className="flex-1">
            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
                <Search size={16} />
                <input
                    type="text"
                    value={value}
                    onChange={onChange}
                    placeholder="Search tasks by title"
                    className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
                />
                {value && (
                    <button
                        type="button"
                        onClick={onClear}
                        className="text-gray-400 transition hover:text-gray-600"
                        aria-label="Clear search"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>
        </div>
    )
}