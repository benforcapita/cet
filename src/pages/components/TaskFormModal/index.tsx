import {useEffect, useRef} from "react";
import TaskForm from "../TaskForm";

/**
 * Renders a modal for displaying a task form.
 * @param isVisible - Determines whether the modal is visible or not.
 * @param onClose - Callback function to close the modal.
 * @param ticketId - The ID of the ticket associated with the task form.
 * @returns The rendered TaskFormModal component.
 */
export default function TaskFormModal({
                                          isVisible,
                                          onClose,
                                          ticketId
                                      }: { isVisible: boolean, onClose: () => void, ticketId: number }) {
    const firstInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (isVisible && firstInputRef.current) {
            if ("focus" in firstInputRef.current) {
                firstInputRef.current.focus();
            }
        }
    }, [isVisible]);

    if (!isVisible) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg p-6 relative">
                <TaskForm onClose={onClose} ticketId={ticketId}/>
                <button
                    className="absolute top-2 right-2 text-gray-800 text-xl"
                    onClick={onClose}
                >
                    &times; {/* This is a simple "X" close button */}
                </button>
            </div>
        </div>
    );
}
