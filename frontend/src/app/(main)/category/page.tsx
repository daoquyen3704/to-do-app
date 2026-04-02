'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useCategories } from '@/hooks/queries/useCategories';
import { Trash, Info } from 'lucide-react';
import { notify } from '@/utils/notify';
import { useCategoryMutations } from '@/hooks/mutations/useCategoryMutation';

export default function Category() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data: session } = useSession();
    const accessToken = session?.accessToken as string;

    const { data: categories, isLoading, isError } = useCategories();
    const {addMutation, deleteMutation} = useCategoryMutations(accessToken);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const payload = {
            name: formData.get('name') as string,
            color_code: formData.get('color_code') as string,
        };
        if (!payload.name) return notify("Please enter a category name", "error");
        addMutation.mutate(payload);
        setIsModalOpen(false);
    };

    const handleDelete = (id: number, name: string) => {
        if(window.confirm(`Are you sure you want to delete the category "${name}"?`)){
            deleteMutation.mutate(id);
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
                                    disabled={addMutation.isPending}
                                    className="rounded-xl bg-black px-8 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:bg-gray-400 transition"
                                >
                                    {addMutation.isPending ? "Saving..." : "Save"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
