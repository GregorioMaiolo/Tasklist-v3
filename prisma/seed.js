require('dotenv').config();

const userService = require('../service/user-service');

const adminEmail = process.env.ADMIN_EMAIL || 'admin@tasklist.local';
const adminPassword = process.env.ADMIN_PASSWORD || 'admin1234';

async function main() {
    const admin = await userService.createOrUpdateUser({
        email: adminEmail,
        password: adminPassword,
        role: 'admin'
    });

    console.log(`Admin-Benutzer gespeichert: ${admin.email}`);
}

main()
    .catch((error) => {
        console.error('Der Admin-Benutzer konnte nicht gespeichert werden:', error);
        process.exitCode = 1;
    })
    .finally(() => userService.disconnect());
