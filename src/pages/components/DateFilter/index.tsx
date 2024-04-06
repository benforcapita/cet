export interface DateFilterProps {
    handleDateChange: (date: Date | null) => void;
}

export default function DateFilter({handleDateChange}: DateFilterProps) {
    const handleFilterClick = () => {
        // Call handleDateChange with the selected dates
        const startDate = document.getElementsByName("startDate")[0] as HTMLInputElement;
        const endDate = document.getElementsByName("endDate")[0] as HTMLInputElement;
        handleDateChange(new Date(startDate.value));
        handleDateChange(new Date(endDate.value));
    };

    return (
        <div className="flex gap-2">
            <input className="border p-2 rounded" type="date" name="startDate"/>
            <input className="border p-2 rounded" type="date" name="endDate"/>
            <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600" onClick={handleFilterClick}>
                Filter
            </button>
        </div>
    );
}
