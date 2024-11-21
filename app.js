const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Connection string
const config = {
    user: 'darunpob',
    password: 'your_actual_password',
    server: 'darunpob.database.windows.net',
    database: 'inventorydarunpob',
    options: {
        encrypt: true, // ใช้สำหรับ Azure SQL
        trustServerCertificate: false,
    },
};


app.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const pool = await sql.connect(config);
      const result = await pool
        .request()
        .input('username', sql.NVarChar, username)
        .input('password', sql.NVarChar, password)
        .query('SELECT * FROM Users WHERE Username = @username AND Password = @password');
  
      if (result.recordset.length > 0) {
        res.status(200).send({ status: 'success', message: 'Login successful' });
      } else {
        res.status(401).send({ status: 'error', message: 'Invalid credentials' });
      }
    } catch (err) {
      console.error('Database error:', err);
      res.status(500).send({ status: 'error', message: 'Failed to login' });
    }
  });
  

// API เชื่อมต่อฐานข้อมูล
app.post('/register', async (req, res) => {
    const { username, password, email } = req.body;

    try {
        const pool = await sql.connect(config);
        await pool.request()
            .input('username', sql.NVarChar, username)
            .input('password', sql.NVarChar, password)
            .input('email', sql.NVarChar, email)
            .query('INSERT INTO Users (Username, Password, Email) VALUES (@username, @password, @email)');

        res.status(200).send({ message: 'User registered successfully!' });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).send({ error: 'Failed to register user' });
    }
});

// เริ่มเซิร์ฟเวอร์
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
