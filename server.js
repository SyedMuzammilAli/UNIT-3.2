const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const port = 3000;
const mongoUrl = 'YOUR_MONGO_URL';
const dbName = 'myteamdb';
const collectionName = 'packers_team';

app.use(bodyParser.json());

let db;
MongoClient.connect(mongoUrl, { useUnifiedTopology: true }, (err, client) => {
    if (err) {
        console.error(err);
        return;
    }
    db = client.db(dbName);
});

app.post('/players', (req, res) => {
    const player = req.body;
    db.collection(collectionName).insertOne(player, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error adding player');
        } else {
            res.status(201).send('Player added');
        }
    });
});

app.put('/players/:id', (req, res) => {
    const playerId = req.params.id;
    const updates = req.body;
    db.collection(collectionName).updateOne(
        { _id: playerId },
        { $set: updates },
        (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error updating player');
            } else {
                res.status(200).send('Player updated');
            }
        }
    );
});

app.delete('/players/:id', (req, res) => {
    const playerId = req.params.id;
    db.collection(collectionName).deleteOne({ _id: playerId }, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error deleting player');
        } else {
            res.status(200).send('Player deleted');
        }
    });
});

app.get('/players/query1', (req, res) => {
    db.collection(collectionName)
        .find()
        .sort({ touchdowns_thrown: -1 })
        .limit(1)
        .toArray((err, result) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error executing query');
            } else {
                res.status(200).json(result);
            }
        });
});

app.get('/players/query2', (req, res) => {
    db.collection(collectionName)
        .find()
        .sort({ rushing_yards: -1 })
        .limit(1)
        .toArray((err, result) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error executing query');
            } else {
                res.status(200).json(result);
            }
        });
});
// Run the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
