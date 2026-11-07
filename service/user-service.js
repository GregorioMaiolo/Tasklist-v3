const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

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

exports.disconnect = () => prisma.$disconnect();
