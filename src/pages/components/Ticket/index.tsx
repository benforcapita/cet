// components/Ticket.js or app/components/Ticket.tsx

interface TicketProps {
    title: string;
    owner: string;
    status: string;
    dueDate: Date | string;
}

/**
 * Renders a ticket component.
 *
 * @param {TicketProps} props - The props for the ticket component.
 * @param {string} props.title - The title of the ticket.
 * @param {string} props.owner - The owner of the ticket.
 * @param {string} props.status - The status of the ticket.
 * @param {Date} props.dueDate - The due date of the ticket.
 * @returns {JSX.Element} The rendered ticket component.
 */
export default function Ticket({title, owner, status, dueDate}: TicketProps) {
    const getColor = (status: string) => {
        switch (status) {
            case 'todo':
                return 'border-blue-400';
            case 'bug':
                return 'border-red-400';
            case 'inProgress':
                return 'border-yellow-400';
            case 'done':
                return 'border-green-400';
            default:
                return 'border-gray-400';
        }
    };

    const ticket = {title, owner, status, dueDate};
    return (
        <div className="border p-4 rounded mb-2 shadow-sm  text-gray-700">
            <div className={`border-l-4 pl-3 ${getColor(ticket.status)} rounded`}>
                <h4 className="text-md font-semibold">{ticket.title}</h4>
                <p className="text-sm">{ticket.owner}</p>
                <p className="text-xs">{ticket.dueDate.toString()}</p>
            </div>
        </div>
    );
}
