import {TICKET_STATUS} from "@/pages/constants";
import {useState} from "react";

/**
 * Renders a form for adding a ticket.
 * @param onClose - Function to close the form.
 */
export default function TicketForm({onClose}: { onClose: any }) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        owner: "",
        status: TICKET_STATUS.IN_PROGRESS,
        priority: 1,
        dueDate: new Date().toISOString(),
    });

    const handleChange = (e: { target: { name: any; value: any } }) => {
        console.log(formData);
        const {name, value} = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        const dataToSend = {
            ...formData,
            priority: Number(formData.priority),
            dueDate: new Date(formData.dueDate).toISOString(),
        };

        console.log(dataToSend);
        try {
            const response = await fetch("/api/tickets", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataToSend),
            });

            if (!response.ok) {
                throw new Error("Something went wrong");
            }

            // Assuming you want to close the modal upon successful submission
            onClose();

            // Optionally, clear the form or provide user feedback
        } catch (error) {
            console.error("Failed to submit ticket", error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-4 rounded-lg space-y-4"
            >
                <input
                    className="border p-2 rounded w-full  text-gray-700"
                    type="text"
                    placeholder="Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />
                <textarea
                    className="border p-2 rounded w-full  text-gray-700"
                    placeholder="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                />
                <input
                    className="border p-2 rounded w-full  text-gray-700"
                    type="text"
                    placeholder="Owner"
                    name="owner"
                    value={formData.owner}
                    onChange={handleChange}
                    required
                />
                <select
                    className="border p-2 rounded w-full  text-gray-700"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                >
                    <option value={TICKET_STATUS.TODO}>To Do</option>
                    <option value={TICKET_STATUS.IN_PROGRESS}>In progress</option>
                    <option value={TICKET_STATUS.BUG}>Bugs</option>
                </select>
                <select
                    className="border p-2 rounded w-full"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    required
                >
                    <option value={1}>Low</option>
                    <option value={2}>Medium</option>
                    <option value={3}>High</option>
                </select>
                <input
                    className="border p-2 rounded w-full  text-gray-700"
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    required
                />
                <button
                    onClick={onClose}
                    className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    Add Ticket
                </button>
            </form>
        </div>
    );
}
