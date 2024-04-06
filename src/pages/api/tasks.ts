// app/api/tasks.ts
import {NextApiRequest, NextApiResponse} from 'next';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Handles HTTP requests for tasks.
 * @param req - The NextApiRequest object representing the incoming request.
 * @param res - The NextApiResponse object representing the outgoing response.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const tasks = await prisma.task.findMany();
            res.status(200).json(tasks);
        } catch (error) {
            res.status(500).json({message: 'Failed to retrieve tasks', error});
        }
    } else if (req.method === 'POST') {
        try {
            const {title, description, owner, status, ticketId} = req.body;
            const newTask = await prisma.task.create({
                data: {
                    title,
                    description,
                    owner,
                    status,
                    ticketId,
                },
            });
            res.status(201).json(newTask);
        } catch (error) {
            res.status(400).json({message: 'Failed to create a new task', error});
        }
    } else {
        // Unsupported HTTP method
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
