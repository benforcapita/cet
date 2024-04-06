// app/api/tasks/[id].ts
import {NextApiRequest, NextApiResponse} from 'next';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const taskId = req.query.id;

    if (req.method === 'GET') {
        // Retrieve a specific task
        try {
            const task = await prisma.task.findUnique({
                where: {id: Number(taskId)},
            });
            if (task) {
                res.status(200).json(task);
            } else {
                res.status(404).json({message: 'Task not found'});
            }
        } catch (error) {
            res.status(500).json({message: 'Failed to retrieve the task', error});
        }
    } else if (req.method === 'PUT') {
        // Update a specific task
        try {
            const {title, description, owner, status} = req.body;
            const updatedTask = await prisma.task.update({
                where: {id: Number(taskId)},
                data: {
                    title,
                    description,
                    owner,
                    status,
                },
            });
            res.status(200).json(updatedTask);
        } catch (error) {
            res.status(400).json({message: 'Failed to update the task', error});
        }
    } else if (req.method === 'DELETE') {
        // Delete a specific task
        try {
            const deletedTask = await prisma.task.delete({
                where: {id: Number(taskId)},
            });
            res.status(200).json(deletedTask);
        } catch (error) {
            res.status(400).json({message: 'Failed to delete the task', error});
        }
    } else {
        // Unsupported HTTP method
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
