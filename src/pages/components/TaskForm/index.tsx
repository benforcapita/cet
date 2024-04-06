// components/TaskForm.js or app/components/TaskForm.tsx

import {TICKET_STATUS} from '@/pages/constants';
import React, {useState} from 'react';

/**
 * Renders a form for creating a new task.
 * @param onClose - Function to close the form.
 * @param ticketId - ID of the ticket associated with the task.
 */
export default function TaskForm({onClose, ticketId}: { onClose: any, ticketId: number }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        owner: '',
        status: TICKET_STATUS.TODO, // Add status with a default value
        ticketId: ticketId
    });

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        const {name, value} = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };

    // Handle form submission
    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        // TODO: Validate the input data

        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const result = await response.json();
            setFormData({ticketId: 0, title: '', description: '', owner: '', status: TICKET_STATUS.TODO});

            onClose();
        } catch (error) {
            console.error('Failed to submit the form: ', error);
        }
    };

    return (
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            <label className="block">
                <span className="text-gray-700">Title</span>
                <input
                    className="border p-2 rounded w-full text-gray-700"
                    type="text"
                    placeholder="Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required // assuming title is required
                />
            </label>
            <label className="block">
                <span className="text-gray-700">Description</span>
                <textarea
                    className="border p-2 rounded w-full text-gray-700"
                    placeholder="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                />
            </label>
            <label className="block">
                <span className="text-gray-700">Owner</span>
                <input
                    className="border p-2 rounded w-full text-gray-700"
                    type="text"
                    placeholder="Owner"
                    name="owner"
                    value={formData.owner}
                    onChange={handleChange}
                    required // assuming owner is required
                />
            </label>
            <button type="submit" onSubmit={handleSubmit}
                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                Add a new Task
            </button>
        </form>
    );
}
