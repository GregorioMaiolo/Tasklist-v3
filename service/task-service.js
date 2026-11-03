const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.getAllTasks = () =>
    prisma.task.findMany({
        orderBy: [
            { done: 'asc' },
            { dueDate: 'asc' }
        ]
    });

exports.getTaskById = (id) =>
    prisma.task.findUnique({ where: { id } });

exports.createTask = (task) =>
    prisma.task.create({ data: task });

exports.completeTask = (id) =>
    prisma.task.update({ where: { id }, data: { done: true } });

exports.deleteTask = (id) =>
    prisma.task.delete({ where: { id } });
