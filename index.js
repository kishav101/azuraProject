const express = require('express');
const sql = require('mssql/msnodesqlv8');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static('public'));

const dbConfig = {
    connectionString: 'Driver={SQL Server};Server=localhost\\SQLEXPRESS;Database=azura;Trusted_Connection=Yes;',
    driver: 'msnodesqlv8'
};

app.get('/getAllData', async (req, res) => {
    let conn = null;
    try {
        conn = await sql.connect(dbConfig);
        const result = await conn.request().query("SELECT * FROM vehiclestbl");
        if (!result.recordset.length) {
            return res.status(404).json({ success: false, message: "Vehicle not found" });
        }
        res.json(result.recordset);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        if (conn) conn.close();
    }
});

app.post('/getAllDataById', async (req, res) => {
    let conn = null;
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ error: 'Missing vehicle ID' });
        }

        conn = await sql.connect(dbConfig);
        const result = await conn.request()
            .input('Id', sql.Int, id)
            .query("SELECT * FROM vehiclestbl WHERE vehicleID = @Id");

        res.json(result.recordset);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        if (conn) conn.close(); 
    }
});

app.post('/insertData', async (req, res) => {
    let conn = null;
    try {
        const { make, model, km, color, location, value } = req.body;
        conn = await sql.connect(dbConfig);
        const result = await conn.request()
            .input('Make', sql.VarChar, make)
            .input('Model', sql.VarChar, model)
            .input('KM', sql.Int, km)
            .input('Color', sql.VarChar, color)
            .input('Location', sql.VarChar, location)
            .input('Value', sql.Int, value)
            .query('INSERT INTO VEHICLESTBL (MAKE, MODEL, KM, COLOR, LOCATION, VALUE) VALUES (@Make, @Model, @KM, @Color, @Location, @Value)');
        res.status(200).json({ success: true, message: "Vehicle inserted successfully" });

    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to insert data' });
    } finally {
        if (conn) conn.close();
    }
});

app.get('/viewVehicles', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.listen(3000, () => {
    console.log("server has started on port 3000");
});
