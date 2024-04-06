import React, {useEffect, useState} from 'react';
import {TICKET_STATUS} from '@/pages/constants';
import TaskFormModal from '../TaskFormModal';

/**
 * Renders a modal for updating a ticket.
 *
 * @param isOpen - Indicates whether the modal is open or not.
 * @param onClose - Callback function to close the modal.
 * @param ticketId - The ID of the ticket to be updated.
 * @param updateTicket - Callback function to update the ticket.
 * @returns The JSX element representing the update ticket form modal.
 */
function UpdateTicketFormModal({
                                   isOpen,
                                   onClose,
                                   ticketId,
                                   updateTicket
                               }: { isOpen: boolean, onClose: () => void, ticketId: number, updateTicket: (id: number, details: any) => void }): React.JSX.Element {
    const [ticketDetails, setTicketDetails] = useState({
        title: '',
        description: '',
        owner: '',
        status: '',
    });
    const [tasks, setTasks] = useState<any[]>([]);
    const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // Fetch ticket details
            fetch(`/api/tickets/${ticketId}`)
                .then((res) => res.json())
                .then(setTicketDetails);

            // Fetch related tasks
            fetch(`/api/tasks`)
                .then((res) => res.json())
                .then((tasks) => tasks.filter((task: any) => task.ticketId === ticketId))
                .then(setTasks);
        }
    }, [isOpen, ticketId]);

    const handleUpdate = () => {
        fetch(`/api/tickets/${ticketId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ticketDetails),
        }).then(() => {
            updateTicket(ticketId, ticketDetails);
            onClose();
        });
    };

    if (!isOpen) return <></>;

    function openTaskForm(): void {
        setIsTaskFormOpen(true);
    }

    function changeTaskStatus(taskId: number, newStatus: string): void {
        fetch(`/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({status: newStatus}),
        }).then(() => {
            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task.id === taskId ? {...task, status: newStatus} : task
                )
            );
        });
        //if all the tasks are completed, update the ticket status to done
        const allTasksCompleted = tasks.every((task) => task.status === 'completed');
        if (allTasksCompleted) {
            setTicketDetails((prevTicketDetails) => ({
                ...prevTicketDetails,
                status: TICKET_STATUS.DONE,
            }));
        }

    }

    return (
        <>
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full text-gray-700">
                <div className="relative top-20 mx-auto shadow-lg rounded-md bg-white max-w-md">
                    <h2 className="text-lg font-bold p-4">Update Ticket</h2>
                    <form className="p-4 space-y-4">
                        <label className="block">
                            <span className="text-gray-700">Title</span>
                            <input
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                type="text"
                                value={ticketDetails?.title}
                                onChange={(e) => setTicketDetails({...ticketDetails, title: e.target.value})}
                            />
                        </label>
                        <label className="block">
                            <span className="text-gray-700">Description</span>
                            <textarea
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={ticketDetails?.description}
                                onChange={(e) => setTicketDetails({...ticketDetails, description: e.target.value})}
                            />
                        </label>
                        <label className="block">
                            <span className="text-gray-700">Owner</span>
                            <input
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                type="text"
                                value={ticketDetails?.owner}
                                onChange={(e) => setTicketDetails({...ticketDetails, owner: e.target.value})}
                            />
                        </label>
                        <label className="block">
                            <span className="text-gray-700">Status</span>
                            <select
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={ticketDetails?.status}
                                onChange={(e) => setTicketDetails({...ticketDetails, status: e.target.value})}
                            >
                                <option value={TICKET_STATUS.TODO}>To Do</option>
                                <option value={TICKET_STATUS.IN_PROGRESS}>In Progress</option>
                                <option value={TICKET_STATUS.BUG}>Bug</option>
                                <option value={TICKET_STATUS.DONE}>Done</option>
                            </select>
                        </label>
                    </form>
                    <div className="p-4">
                        <h3 className="text-lg font-bold">Tasks</h3>
                        <button onClick={openTaskForm}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded">
                            Add Task
                        </button>
                        <ul className="space-y-2">
                            {tasks.map((task) => (
                                TaskItem(task, changeTaskStatus)
                            ))}
                        </ul>
                    </div>
                    <div className="flex justify-end space-x-4 p-4">
                        <button
                            className="px-2 py-2 text-sm font-bold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            onClick={onClose}
                        >
                            Close
                        </button>
                        <button
                            className="px-2 py-2 text-sm font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            onClick={handleUpdate}
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
            <TaskFormModal isVisible={isTaskFormOpen} onClose={() => {
                setIsTaskFormOpen(false)
            }} ticketId={ticketId}/>
        </>
    );
}

export default UpdateTicketFormModal;

function TaskItem(task: any, changeTaskStatus: (taskId: number, newStatus: string) => void): React.JSX.Element {
    return (
        <li key={task.id} className="flex justify-between border border-gray-300 p-2">
            <span className="flex-grow">{task.title}</span>
            <button
                onClick={() => changeTaskStatus(task.id, 'todo')}
                className={`bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 rounded ${task.status === 'todo' ? 'text-xl font-bold' : ''}`}
            >
                To Do
            </button>
            <button
                onClick={() => changeTaskStatus(task.id, 'in_progress')}
                className={`bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-2 rounded ${task.status === 'in_progress' ? 'text-xl font-bold' : ''}`}
            >
                In Progress
            </button>
            <button
                onClick={() => changeTaskStatus(task.id, 'completed')}
                className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-2 rounded ${task.status === 'completed' ? 'text-xl font-bold' : ''}`}
            >
                Complete
            </button>
        </li>
    );
}

