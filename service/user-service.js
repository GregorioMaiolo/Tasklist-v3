const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.getAdmin = () =>
    prisma.user.findFirst({
        where: { role: 'admin' }
    });

exports.createOrUpdateUser = async ({
    email,
    password,
    profilePicture = null,
    role = 'user'
}) => {
    const passwordHash = await bcrypt.hash(password, 12);

    return prisma.user.upsert({
        where: { email },
        create: {
            email,
            password: passwordHash,
            profilePicture,
            role
        },
        update: {
            password: passwordHash,
            profilePicture,
            role
        }
    });
};

exports.registerUser = async ({ email, password }) => {
    const passwordHash = await bcrypt.hash(password, 12);
    const dueDate = new Date();
    dueDate.setHours(0, 0, 0, 0);
    dueDate.setDate(dueDate.getDate() + 3);

    return prisma.$transaction(async (transaction) => {
        const admin = await transaction.user.findFirst({
            where: { role: 'admin' }
        });

        if (!admin) {
            const error = new Error('Admin-Benutzer nicht gefunden.');
            error.code = 'ADMIN_NOT_FOUND';
            throw error;
        }

        const user = await transaction.user.create({
            data: {
                email,
                password: passwordHash,
                role: 'user'
            }
        });

        await transaction.task.create({
            data: {
                title: 'Profilbild hochladen',
                description: null,
                dueDate,
                done: false,
                createdById: admin.id,
                assignedToId: user.id
            }
        });

        return user;
    });
};

exports.disconnect = () => prisma.$disconnect();
