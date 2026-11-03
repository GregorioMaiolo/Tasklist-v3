const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const isValidDate = (value) => {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return false;
    }

    const date = new Date(`${value}T00:00:00.000Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

// Startseite anzeigen
exports.getTasks = async (req, res) => {
    try {
        const tasks = await prisma.task.findMany({
            orderBy: [
                { done: 'asc' },
                { dueDate: 'asc' }
            ]
        });

        res.render('index', { tasks });
    } catch (error) {
        console.error('Die Aufgaben konnten nicht aus der Datenbank geladen werden:', error);
        res.status(503).send('Die Aufgaben konnten nicht geladen werden. Die Datenbank ist momentan nicht erreichbar.');
    }
};

// Formular für neue Aufgabe anzeigen
exports.getNewTask = (req, res) => {
    res.render('new-task');
};

// Neue Aufgabe erstellen
exports.createTask = async (req, res) => {
    const title = typeof req.body.title === 'string' ? req.body.title.trim() : '';
    const description = typeof req.body.description === 'string' ? req.body.description.trim() : '';
    const dueDate = req.body.dueDate;

    if (!title || !isValidDate(dueDate)) {
        return res.status(400).send('Ungültige Eingabe: Titel und ein gültiges Fälligkeitsdatum sind erforderlich.');
    }

    try {
        await prisma.task.create({
            data: {
                title,
                description: description || null,
                dueDate: new Date(`${dueDate}T00:00:00.000Z`),
                done: false
            }
        });

        res.redirect('/');
    } catch (error) {
        console.error('Die Aufgabe konnte nicht gespeichert werden:', error);
        res.status(503).send('Die Aufgabe konnte nicht gespeichert werden. Die Datenbank ist momentan nicht erreichbar.');
    }
};

// Aufgabe als erledigt markieren
exports.completeTask = async (req, res) => {
    const id = Number(req.params.id);

    try {
        const task = await prisma.task.findUnique({ where: { id } });
        if (!task) {
            return res.status(404).send('Aufgabe nicht gefunden.');
        }

        await prisma.task.update({ where: { id }, data: { done: true } });
        res.redirect('/');
    } catch (error) {
        console.error('Die Aufgabe konnte nicht als erledigt markiert werden:', error);
        res.status(503).send('Die Aufgabe konnte nicht aktualisiert werden. Die Datenbank ist momentan nicht erreichbar.');
    }
};

// Aufgabe löschen
exports.deleteTask = async (req, res) => {
    const id = Number(req.params.id);

    try {
        const task = await prisma.task.findUnique({ where: { id } });
        if (!task) {
            return res.status(404).send('Aufgabe nicht gefunden.');
        }

        await prisma.task.delete({ where: { id } });
        res.redirect('/');
    } catch (error) {
        console.error('Die Aufgabe konnte nicht gelöscht werden:', error);
        res.status(503).send('Die Aufgabe konnte nicht gelöscht werden. Die Datenbank ist momentan nicht erreichbar.');
    }
};
