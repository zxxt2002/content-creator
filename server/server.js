const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

const users = []; // In a real-world application, you'd use a database

app.post('/register', (req, res) => {
    const hashedPassword = bcrypt.hashSync(req.body.password, 8);

    users.push({
        id: users.length + 1,
        username: req.body.username,
        password: hashedPassword
    });

    res.status(200).send({ message: "User registered successfully!" });
});

app.post('/login', (req, res) => {
    const user = users.find(user => user.username === req.body.username);
    if (!user) return res.status(404).send('No user found.');
    
    const isPasswordValid = bcrypt.compareSync(req.body.password, user.password);
    if (!isPasswordValid) return res.status(401).send({ auth: false, token: null });
    
    const token = jwt.sign({ id: user.id }, 'supersecret', { expiresIn: 86400 });
    res.status(200).send({ auth: true, token: token });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
