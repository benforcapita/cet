// app/api/tickets.ts
import {NextApiRequest, NextApiResponse} from 'next';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Handles HTTP requests for the tickets API.
 * @param req - The NextApiRequest object representing the incoming request.
 * @param res - The NextApiResponse object representing the outgoing response.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const tickets = await prisma.ticket.findMany({
                include: {
                    tasks: true,
                },
            });
            res.status(200).json(tickets);
        } catch (error) {
            res.status(500).json({message: 'Failed to retrieve tickets', error});
        }
    } else if (req.method === 'POST') {
        try {
            const {title, description, owner, dueDate, status, priority} = req.body;
            const newTicket = await prisma.ticket.create({
                data: {
                    title,
                    description,
                    owner,
                    dueDate: dueDate || new Date(), // Use provided dueDate or default to now
                    status,
                    priority,
                },
            });
            res.status(201).json(newTicket);
        } catch (error) {
            res.status(400).json({message: 'Failed to create a new ticket', error});
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
