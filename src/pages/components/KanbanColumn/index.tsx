import React from 'react';
import {Droppable} from '@hello-pangea/dnd';


export const KanbanColumn = ({
                                 title,
                                 droppableId,
                                 children
                             }: { title: string; droppableId: string; children: React.ReactNode; }) => (
    <div className="kanban-column">
        <h3>{title}</h3>
        <Droppable droppableId={droppableId}>
            {(provided, snapshot) => (
                <div ref={provided.innerRef} {...provided.droppableProps} style={{height: '100%'}}>
                    {children}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    </div>
);
