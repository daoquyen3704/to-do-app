type CreateTaskModalProps = {
    onClose: () => void;
    onSubmit: (formData: FormData) => void;
    onToggleAllDay: (checked: boolean) => void;
    isAllDay: boolean;
    defaultDay: string;
}

export default function CreateTaskModal({ onClose, onSubmit, onToggleAllDay, isAllDay, defaultDay }: CreateTaskModalProps) {

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            <div className="relative w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl">
                <h3 className="text-xl font-bold text-gray-900">Create Task</h3>
                <form className="mt-6 space-y-4" onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    onSubmit(formData);
                }}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                            type="text"
                            className="mt-1 w-full rounded-lg border border-gray-200 p-2.5"
                            placeholder="Add title"
                            name="title"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            rows={3}
                            className="mt-1 w-full rounded-lg border border-gray-200 p-2.5"
                            placeholder="Add description"
                            name="description"
                        />
                    </div>
                    <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 border border-gray-100">
                        <input
                            id="is_all_day"
                            type="checkbox"
                            name="is_all_day"
                            checked={isAllDay}
                            onChange={(e) => onToggleAllDay(e.target.checked)}
                            className="h-5 w-5 rounded border-gray-300 cursor-pointer"
                        />
                        <label htmlFor="is_all_day" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
                            This is an all-day task
                        </label>
                    </div>
                    <div className={`grid gap-4 ${isAllDay ? 'grid-cols-1' : 'grid-cols-3'}`}>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Select Date</label>
                            <input
                                type="date"
                                name="day"
                                defaultValue={defaultDay}
                                className="mt-2 w-full rounded-lg border border-gray-200 p-2.5 text-sm focus:ring-2 outline-none"
                            />
                        </div>

                        {!isAllDay && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Start Time</label>
                                    <input
                                        type="time"
                                        name="start_time"
                                        className="mt-2 w-full rounded-lg border border-gray-200 p-2.5 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">End Time</label>
                                    <input
                                        type="time"
                                        name="end_time"
                                        className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-sm"
                                    />
                                </div>
                            </>
                        )}

                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Priority</label>
                            <select
                                className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-sm"
                                name="priority"
                                defaultValue="Low"
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Status</label>
                            <select
                                className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-sm"
                                name="status"
                                defaultValue="Pending"
                            >
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Color</label>
                            <input
                                type="color"
                                name="color"
                                defaultValue="#000"
                                className="mt-1 h-[42px] w-full cursor-pointer rounded-lg border border-gray-200 p-1"
                            />
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white     transition"
                        >
                            Create task
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
