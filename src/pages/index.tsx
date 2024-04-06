import React, {useEffect, useState} from 'react';
import {Ticket as TicketType} from '@prisma/client';
import DateFilter from './components/DateFilter';
import TicketFormModal from "@/pages/components/TicketFormModal";
import {DragDropContext} from '@hello-pangea/dnd';
import {AddTicketButton} from './components/AddTicketButton';
import {KanbanColumn} from './components/KanbanColumn';
import {TicketDraggable} from './components/TicketDraggable';
import {TICKET_STATUS} from './constants';
import UpdateTicketFormModal from './components/UpdateTicketFormModal';
import {useRouter} from 'next/router';


export default function Home() {
    const [tickets, setTickets] = useState<TicketType[]>([]);
    const [isTaskFormVisible, setTaskFormVisible] = useState(false);
    const router = useRouter();
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const openTaskForm = () => {
        setTaskFormVisible(true);
    };
    const closeTaskForm = () => {
        setTaskFormVisible(false);
        router.reload();
    };

    const [selectedTicketId, setSelectedTicketId] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleDateChange = (date: Date | null) => {
        const filteredTickets = selectedDate
            ? tickets.filter(ticket => new Date(ticket.dueDate).toDateString() === selectedDate.toDateString())
            : tickets;
        setTickets(filteredTickets);
        setSelectedDate(date);
    };

    const openModal = (ticketId: number) => {
        setSelectedTicketId(ticketId);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const updateTicketInState = (ticketId: any, updatedDetails: any) => {
        const updatedTickets = tickets.map((ticket) => {
            if (ticket.id === ticketId) {
                return {
                    ...ticket,
                    ...updatedDetails,
                };
            }
            console.log("update ticket");
            return ticket;
        });
        setTickets(updatedTickets);
    };


    useEffect(() => {
        async function fetchTickets() {
            const response = await fetch('/api/tickets');
            const data = await response.json();
            setTickets(data);
        }

        fetchTickets();
    }, []);

    const [columns, setColumns] = useState<{
        todo: JSX.Element[];
        inProgress: JSX.Element[];
        bug: JSX.Element[];
        done: JSX.Element[];
    }>({
        todo: [],
        inProgress: [],
        bug: [],
        done: [],
    });

    useEffect(() => {
        const todoTickets = tickets
            .filter((ticket) => ticket.status === TICKET_STATUS.TODO)
            .map((ticket, index) => (
                <TicketDraggable key={ticket.id} ticket={ticket} index={index} openModal={openModal}/>
            ));
        const bugTickets = tickets
            .filter((ticket) => ticket.status === TICKET_STATUS.BUG)
            .map((ticket, index) => (
                <TicketDraggable key={ticket.id} ticket={ticket} index={index} openModal={openModal}/>
            ));
        const inProgressTickets = tickets
            .filter((ticket) => ticket.status === TICKET_STATUS.IN_PROGRESS)
            .map((ticket, index) => (
                <TicketDraggable key={ticket.id} ticket={ticket} index={index} openModal={openModal}/>
            ));
        const doneTickets = tickets
            .filter((ticket) => ticket.status === TICKET_STATUS.DONE)
            .map((ticket, index) => (
                <TicketDraggable key={ticket.id} ticket={ticket} index={index} openModal={openModal}/>
            ));

        setColumns({
            todo: todoTickets,
            inProgress: inProgressTickets,
            bug: bugTickets,
            done: doneTickets,
        });
    }, [tickets]);


    const onDragEnd = async (result: { destination: any; source: any; draggableId: any; }) => {

        const {destination, source, draggableId} = result;
        if (!destination) {
            return;
        }

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const updatedTickets = Array.from(tickets);
        const [removed] = updatedTickets.splice(source.index, 1);
        if (removed) {
            updatedTickets.splice(destination.index, 0, removed);
            removed.status = destination.droppableId;
            await fetch(`/api/tickets/${draggableId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({status: destination.droppableId}),
            });
            setTickets(updatedTickets);
            //TODO - I know this is not the best way to fix the problem for the droping the ticket, but I'm tired and I need to sleep
            router.reload();
        }
    };


    return (
        <>
            <UpdateTicketFormModal
                isOpen={isModalOpen}
                onClose={closeModal}
                ticketId={selectedTicketId}
                updateTicket={updateTicketInState}
            />
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="container mx-auto p-4  text-gray-700">
                    <DateFilter handleDateChange={handleDateChange}/>
                    <AddTicketButton openTaskForm={openTaskForm}/>
                    <TicketFormModal isOpen={isTaskFormVisible} onClose={closeTaskForm}/>
                    {Board(columns)}
                </div>
            </DragDropContext>

        </>

    );
}

function Board(columns: { todo: JSX.Element[]; inProgress: JSX.Element[]; bug: JSX.Element[]; done: JSX.Element[]; }) {
    return <div className="kanban-board">
        <KanbanColumn title="To Do" droppableId={TICKET_STATUS.TODO}>
            <div>
                {columns.todo}
            </div>
        </KanbanColumn>
        <KanbanColumn title="In Progress" droppableId={TICKET_STATUS.IN_PROGRESS}>
            <div>
                {columns.inProgress}
            </div>
        </KanbanColumn>
        <KanbanColumn title="Bugs" droppableId={TICKET_STATUS.BUG}>
            <div>
                {columns.bug}
            </div>
        </KanbanColumn>
        <KanbanColumn title="Done" droppableId={TICKET_STATUS.DONE}>
            <div>
                {columns.done}
            </div>
        </KanbanColumn>
    </div>;
}

