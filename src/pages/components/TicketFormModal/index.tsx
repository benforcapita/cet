// components/Modal.js or components/Modal.tsx

import TicketForm from "@/pages/components/TickcetForm";

/**
 * Renders a modal component for a ticket form.
 * @param isOpen - A boolean indicating whether the modal is open or not.
 * @param onClose - A function to be called when the modal is closed.
 * @returns The JSX element representing the ticket form modal.
 */
const TicketFormModal = ({isOpen, onClose}: { isOpen: boolean, onClose: () => void }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded-lg max-w-sm w-full space-y-4">
                <TicketForm onClose={onClose}/>
                <button
                    onClick={onClose}
                    className="mt-4 bg-red-500 text-white p-2 rounded hover:bg-red-600 w-full"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default TicketFormModal;
