'use client';
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateProfile, useMe } from "@/services/user";
import { useSession } from "next-auth/react";
import { UpdateProfilePayload } from "@/types/auth";
import { notify } from "@/utils/notify"; 

export default function Profile() {
    const queryClient = useQueryClient();
    const { data: session } = useSession();
    const accessToken = session?.accessToken as string;
    
    const { data: user, isLoading: isUserLoading } = useMe(accessToken);

    const { mutate, isPending } = useMutation({
        mutationFn: (data: UpdateProfilePayload) => UpdateProfile(data, accessToken),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['me'] });
            notify("Profile updated successfully", "success");
        }, 
        onError: (error: any) => {
            const msg = error.message || "Error updating profile";
            notify(msg, "error");
        }
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const payload: UpdateProfilePayload = {
            first_name: formData.get('first_name') as string,
            last_name: formData.get('last_name') as string,
            email: formData.get('email') as string,
        };
        mutate(payload);
    };

    if (isUserLoading) return <div className="flex justify-center p-10">Loading...</div>;

    return (
        <div className="min-h-screen flex items-center justify-center bg-white p-4">
            <div className="w-full max-w-md border shadow-sm p-8 rounded-2xl">
                <h1 className="text-2xl font-bold text-center mb-6 text-black">Edit Profile</h1>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block mb-1.5 text-sm font-medium text-black">Username</label>
                        <input 
                            type="text" 
                            disabled 
                            value={user?.username || ''}
                            className="w-full rounded-lg border bg-gray-50 text-gray-500 border-gray-200 px-4 py-2.5 text-sm outline-none" 
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1.5 text-sm font-medium text-black">First name</label>
                            <input 
                                type="text" 
                                name="first_name" 
                                defaultValue={user?.first_name}
                                className="w-full rounded-lg border text-black border-gray-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-black outline-none transition" 
                            />
                        </div>
                        <div>
                            <label className="block mb-1.5 text-sm font-medium text-black">Last name</label>
                            <input 
                                type="text" 
                                name="last_name" 
                                defaultValue={user?.last_name}
                                className="w-full rounded-lg border text-black border-gray-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-black outline-none transition" 
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block mb-1.5 text-sm font-medium text-black">Email</label>
                        <input 
                            type="email" 
                            name="email" 
                            defaultValue={user?.email}
                            className="w-full rounded-lg border text-black border-gray-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-black outline-none transition" 
                        />
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-3">
                        <button 
                            type="button"
                            className="rounded-lg px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            disabled={isPending}
                            className="rounded-lg bg-black px-8 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors disabled:bg-gray-400"
                        >
                            {isPending ? "Saving..." : "Submit"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
