// app/api/tickets/[id].ts
import {NextApiRequest, NextApiResponse} from 'next';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const ticketId = req.query.id;

    if (req.method === 'GET') {
        // Retrieve a specific ticket
        try {
            const ticket = await prisma.ticket.findUnique({
                where: {id: Number(ticketId)},
                include: {
                    tasks: true, // Include related tasks
                },
            });
            if (ticket) {
                res.status(200).json(ticket);
            } else {
                res.status(404).json({message: 'Ticket not found'});
            }
        } catch (error) {
            res.status(500).json({message: 'Failed to retrieve the ticket', error});
        }
    } else if (req.method === 'PUT') {
        // Update a specific ticket
        try {
            const {title, description, owner, dueDate, status, priority} = req.body;
            const updatedTicket = await prisma.ticket.update({
                where: {id: Number(ticketId)},
                data: {
                    title,
                    description,
                    owner,
                    dueDate,
                    status,
                    priority,
                },
            });
            res.status(200).json(updatedTicket);
        } catch (error) {
            res.status(400).json({message: 'Failed to update the ticket', error});
        }
    } else if (req.method === 'DELETE') {
        // Delete a specific ticket
        try {
            const deletedTicket = await prisma.ticket.delete({
                where: {id: Number(ticketId)},
            });
            res.status(200).json(deletedTicket);
        } catch (error) {
            res.status(400).json({message: 'Failed to delete the ticket', error});
        }
    } else {
        // Unsupported HTTP method
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
