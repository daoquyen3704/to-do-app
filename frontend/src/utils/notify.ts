import { toast } from "sonner";

export const notify = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    toast[type](message);
};

