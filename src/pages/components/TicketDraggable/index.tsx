import React from 'react';
import {Ticket as TicketType} from '@prisma/client';
import Ticket from '../Ticket';
import {Draggable} from '@hello-pangea/dnd';


// add on click event to open modal

export const TicketDraggable = ({
                                    ticket,
                                    index,
                                    openModal
                                }: { ticket: TicketType; index: number; openModal: (id: number) => void; }) => (
    <Draggable key={ticket.id} draggableId={ticket.id.toString()} index={index}>
        {(provided) => (
            <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                onClick={() => openModal(ticket.id)}
            >
                <Ticket {...ticket} />
            </div>
        )}
    </Draggable>
);
