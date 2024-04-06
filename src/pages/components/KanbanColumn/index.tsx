import React from 'react';
import {Droppable} from '@hello-pangea/dnd';


/**
 * Renders a Kanban column component.
 *
 * @param {string} title - The title of the column.
 * @param {string} droppableId - The ID of the droppable area.
 * @param {React.ReactNode} children - The content of the column.
 * @returns {React.ReactNode} The rendered Kanban column component.
 */
export const KanbanColumn = ({
    title,
    droppableId,
    children
}: {
    title: string;
    droppableId: string;
    children: React.ReactNode;
}) => (
    <div className="kanban-column">
        <h3>{title}</h3>
        <Droppable droppableId={droppableId}>
            {(provided, snapshot) => (
                <div ref={provided.innerRef} {...provided.droppableProps} style={{ height: '100%' }}>
                    {children}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    </div>
);
