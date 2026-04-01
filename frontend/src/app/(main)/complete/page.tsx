'use client';
import { CheckCircle2, RotateCcw, Trash2, Calendar } from 'lucide-react';
export default function CompleteTask(){
    const completedTasks = [
        { id: 1, title: "Design Mini Sidebar", completedAt: "10:30 AM" },
        { id: 2, title: "Configure Djoser Backend", completedAt: "Yesterday" },
    ];
    return (
        <div className="max-w-9xl p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-black">Completed</h2>
                    <p className="text-sm text-gray-500">You have completed {completedTasks.length} tasks</p>
                </div>
                <div className='p-4 rounded-lg flex items-center gap-3'>
                    <button className="border p-1 rounded-2xl text-md hover:underline font-medium">
                        Day
                    </button>
                    <button className="border p-1 rounded-2xl text-md hover:underline font-medium">
                        Week
                    </button>
                    <button className="border p-1 rounded-2xl text-md hover:underline font-medium">
                        Month
                    </button>
                </div>
               
            </div>
            <div className='flex items-center gap-4'>
                <div className=''>List</div>
                <div className='p-2 rounded-lg flex items-center gap-3'>
                    
                </div>
            </div>
                   
        </div>  
    )
}

