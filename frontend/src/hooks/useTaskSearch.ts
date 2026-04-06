import { clearSearchInput, setSearchInput } from "@/store/config/configSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectSearchInput } from "@/store/index";

export function useTaskSearch() {
    const dispatch = useAppDispatch();
    const searchTerm = useAppSelector(selectSearchInput);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setSearchInput(e.target.value));
    };
    
    const handleClearSearch = () => {
        dispatch(clearSearchInput());
    };
    return { searchTerm, handleSearchChange, handleClearSearch };
}
