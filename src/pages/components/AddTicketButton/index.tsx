export const AddTicketButton = ({openTaskForm}: { openTaskForm: () => void }) => (
    <button
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600"
        onClick={openTaskForm}
    >
        Add New Ticket
    </button>
);
