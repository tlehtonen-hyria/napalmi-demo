// server.js

const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'napalmi_demo',
});

app.post('/score', (req, res) => {
  const { player, score } = req.body;
  const sql = 'INSERT INTO scores (player, score) VALUES (?, ?)';

  pool.query(sql, [player, score], (error, results) => {
    if (error) {
      console.error('Error setting player score', error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json({ success: true, message: 'Player score set successfully' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
