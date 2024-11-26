const express = require('express');
const cors = require('cors'); // CORS-Paket importieren
const { MongoClient, ObjectId } = require('mongodb');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// MongoDB-Verbindungsdetails
const url = 'mongodb+srv://HeissiSchoggi:GurgeleIschWichtig420@m324m321.bdyvh.mongodb.net/?retryWrites=true&w=majority&appName=M324M321'; // Ersetze durch die URL deiner Online-Datenbank
const dbName = 'notizdb';
const collectionName = 'notes'; // Definiert die Collection explizit
let db;

// Middleware
app.use(cors()); // CORS aktivieren
app.use(bodyParser.json());

// Verbindung zur MongoDB herstellen
(async () => {
    try {
        const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Mit MongoDB verbunden...');
        db = client.db(dbName);
    } catch (error) {
        console.error('Fehler beim Verbinden mit MongoDB:', error.message);
        process.exit(1); // Beendet die App, wenn keine Verbindung zur Datenbank möglich ist
    }
})();

// --- CRUD-Funktionen ---
// 1. Alle Notizen abrufen
app.get('/notes', async (req, res) => {
    try {
        const notes = await db.collection(collectionName).find().toArray();
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. Eine spezifische Notiz abrufen
app.get('/notes/:id', async (req, res) => {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Ungültige ID' });
    }

    try {
        const note = await db.collection(collectionName).findOne({ _id: new ObjectId(id) });
        if (!note) return res.status(404).json({ error: 'Notiz nicht gefunden' });
        res.status(200).json(note);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. Neue Notiz erstellen
app.post('/notes', async (req, res) => {
    const { title, mainText } = req.body;

    if (!title || !mainText) {
        return res.status(400).json({ error: 'Title und MainText sind erforderlich' });
    }

    const newNote = { title, mainText, lastModified: new Date() };

    try {
        const result = await db.collection(collectionName).insertOne(newNote);
        res.status(201).json(result.ops[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 4. Notiz aktualisieren
app.put('/notes/:id', async (req, res) => {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Ungültige ID' });
    }

    const { title, mainText } = req.body;

    if (!title && !mainText) {
        return res.status(400).json({ error: 'Es muss mindestens ein Feld zum Aktualisieren angegeben werden' });
    }

    const updatedNote = { lastModified: new Date() };
    if (title) updatedNote.title = title;
    if (mainText) updatedNote.mainText = mainText;

    try {
        const result = await db.collection(collectionName).updateOne(
            { _id: new ObjectId(id) },
            { $set: updatedNote }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Notiz nicht gefunden' });
        }

        res.status(200).json({ message: 'Notiz aktualisiert' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 5. Notiz löschen
app.delete('/notes/:id', async (req, res) => {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Ungültige ID' });
    }

    try {
        const result = await db.collection(collectionName).deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Notiz nicht gefunden' });
        }

        res.status(200).json({ message: 'Notiz gelöscht' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Server starten
app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
});

