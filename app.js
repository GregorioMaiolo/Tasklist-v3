require('dotenv').config();
const express = require('express');
const app = express();
const PORT = 3000;

const taskRoutes = require('./routes/taskroutes');
const userRoutes = require('./routes/userroutes');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(express.urlencoded({ extended: true }));

app.use('/', taskRoutes);
app.use('/', userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});