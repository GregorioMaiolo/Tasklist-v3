const userService = require('../service/user-service');

exports.getRegistration = (req, res) => {
    res.render('register', {
        email: '',
        error: null,
        statusCode: null
    });
};

exports.registerUser = async (req, res) => {
    const email = typeof req.body.email === 'string'
        ? req.body.email.trim().toLowerCase()
        : '';
    const password = typeof req.body.password === 'string'
        ? req.body.password
        : '';

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { // Einfache E-Mail-Validierung
        return res.status(400).render('register', {
            email,
            error: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
            statusCode: 400
        });
    }

    if (password.length < 8) {
        return res.status(400).render('register', {
            email,
            error: 'Das Passwort muss mindestens 8 Zeichen lang sein.',
            statusCode: 400
        });
    }

    try {
        await userService.registerUser({ email, password });
        res.redirect('/');
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(409).render('register', {
                email,
                error: 'Diese E-Mail-Adresse wird bereits verwendet.',
                statusCode: 409
            });
        }

        if (error.code === 'ADMIN_NOT_FOUND') {
            console.error('Registrierung fehlgeschlagen: Kein Admin-Benutzer vorhanden.');
            return res.status(503).render('register', {
                email,
                error: 'Die Registrierung ist momentan nicht möglich. Bitte versuchen Sie es später erneut.',
                statusCode: 503
            });
        }

        console.error('Registrierung fehlgeschlagen:', error);
        res.status(503).render('register', {
            email,
            error: 'Die Registrierung konnte nicht gespeichert werden. Die Datenbank ist momentan nicht erreichbar.',
            statusCode: 503
        });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.render('users', { users, error: null });
    } catch (error) {
        console.error('Die Benutzer konnten nicht geladen werden:', error);
        res.status(503).render('users', {
            users: [],
            error: 'Die Benutzer konnten nicht geladen werden. Die Datenbank ist momentan nicht erreichbar.'
        });
    }
};

exports.updateRole = async (req, res) => {
    const id = Number(req.params.id);
    const role = typeof req.body.role === 'string' ? req.body.role : '';

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).send('Ungültige Benutzer-ID.');
    }

    if (role !== 'admin' && role !== 'user') {
        return res.status(400).send('Ungültige Rolle. Erlaubt sind admin und user.');
    }

    try {
        const user = await userService.getUserById(id);
        if (!user) {
            return res.status(404).send('Benutzer nicht gefunden.');
        }

        await userService.updateRole(id, role);
        res.redirect('/benutzer');
    } catch (error) {
        console.error('Die Benutzerrolle konnte nicht geändert werden:', error);
        res.status(503).send('Die Benutzerrolle konnte nicht gespeichert werden. Die Datenbank ist momentan nicht erreichbar.');
    }
};
