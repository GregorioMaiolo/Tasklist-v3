const express = require('express');
const router = express.Router();

const taskController = require('../controller/task-controller');

router.get('/', taskController.getTasks);

router.get('/aufgaben/neu', taskController.getNewTask);

router.post('/aufgaben/neu', taskController.createTask);

router.post('/aufgaben/:id/erledigt', taskController.completeTask);

router.post('/aufgaben/:id/loeschen', taskController.deleteTask);
router.post('/aufgaben/:id/zuweisen', taskController.updateAssignment);

module.exports = router;