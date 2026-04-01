'use client';

import React, { useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { authFetch } from '@/lib/api/auth';
import { toast } from "sonner";
import { deleteCategory, useCategories } from '@/lib/api/category';
import { Trash, Info } from 'lucide-react';
import { deleteTask } from '@/lib/api/task';
import { useRouter } from 'next/navigation';

export default function Category() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const queryClient = useQueryClient();
    const { data: session } = useSession();
    const {data: categories, isLoading, isError} = useCategories();
    const accessToken = session?.accessToken as string;
    const router = useRouter();

    const handleNotify = (message: string, type: 'success' | 'error' = 'success') => {
        toast[type](message);
    };

    const mutation = useMutation({
        mutationFn: async (newCategory: { name: string, color_code: string }) => {
            const token = session?.accessToken;
            if (!token) throw new Error("You must be logged in");
            const res = await authFetch('/categories/', token, {
                method: "POST",
                body: JSON.stringify(newCategory),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.detail || 'Error adding category');
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            setIsModalOpen(false); 
            handleNotify("Category created successfully", "success");
        },
        onError: (error: any) => {
            handleNotify(error.message, "error");
        }
    });

    const deleteCategoryMutation = useMutation({
        mutationFn: async (id: number) => {
            return deleteCategory(id, accessToken);
        },
        onSuccess: (deleteId) => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            queryClient.removeQueries({ queryKey: ['categories', deleteId] });
            handleNotify("Category deleted successfully", "success");
            router.push("/category");
            }
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        
        const payload = {
            name: formData.get('name') as string,
            color_code: formData.get('color_code') as string,
        };

        if (!payload.name) return handleNotify("Please enter a category name", "error");
        
        mutation.mutate(payload);
    };

    const handleDelete = (id: number, name: string) => {
        if(window.confirm(`Are you sure you want to delete the category "${name}"?`)){
            deleteCategoryMutation.mutate(id);
        }
    }

    if(isLoading) return <div className='p-8 text-gray-500 text-sm'>Loading Category...</div>
    if(isError) return <div className='p-8 text-gray-500 text-sm'>An error occurred while loading categories.</div>
    return (
        <div className="max-w-9xl  p-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-md font-semibold uppercase tracking-wider text-gray-500">Categories</h2>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="border rounded-2xl text-sm text-black px-4 py-2 font-medium hover:bg-gray-50 transition"
                >
                    + Add New
                </button>
            </div>

            <div className="space-y-1">
                {categories && categories.length > 0 &&
                categories.map((cat) => ( 
                    <div key={cat.id} className='group flex items-center justify-between rounded-md px-3 py-2 transition-colors hover:bg-gray-100'>   
                        <button
                            className="flex flex-1 items-center gap-3 text-left"
                        >
                            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: cat.color_code || '#e5e7eb' }}>
                            </div>
                            <span>{cat.name}</span>
                        </button>
                        <div className='flex gap-3'>
                            <Info size={18} color='blue' />
                            <Trash size={18} color='red' onClick={() => handleDelete(cat.id, cat.name)}/>
                        </div> 
                    </div>                  
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-8 border border-gray-100 shadow-2xl">
                        <h3 className="font-bold text-black mb-6 text-xl">Add New Category</h3>

                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-[11px] font-bold uppercase text-gray-400 mb-2">Category Name</label>
                                <input 
                                    name='name'
                                    type="text" 
                                    required
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black transition"
                                    autoFocus
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold uppercase text-gray-400 mb-2">Color Code</label>
                                <div className="flex items-center gap-3">
                                    <input 
                                        name='color_code'
                                        type="color" 
                                        defaultValue="#000000"
                                        className="h-10 w-20 cursor-pointer rounded-lg border border-gray-200 p-1"
                                    />
                                    <span className="text-xs text-gray-500 italic">Select representative color</span>
                                </div>
                            </div>

                            <div className="flex  not-odd:justify-end gap-3 pt-4">
                                <button 
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className=" rounded-xl px-5 py-2.5 text-sm text-gray-500 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={mutation.isPending}
                                    className="rounded-xl bg-black px-8 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:bg-gray-400 transition"
                                >
                                    {mutation.isPending ? "Saving..." : "Save"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
