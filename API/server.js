import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';
import bodyParser from 'body-parser';
import path from 'path'; // For serving static files
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// __dirname erstellen
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: './key.env' });

const app = express();
const port = 3000;

// MongoDB-Verbindungsdetails aus Umgebungsvariablen
const url = process.env.MONGODB_URI;

if (!url) {
    console.error('Error: mongoDBUrl is not set in key.env');
    process.exit(1);
}

console.log(`Connecting to MongoDB with URI: ${url}`);

const dbName = 'notizdb';
const collectionName = 'notes'; // Explicitly define the collection
let db;

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'Frontend'))); // Serve static files from the Frontend directory

// Connect to MongoDB and start the server
(async () => {
    try {
        const client = await MongoClient.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB...');
        db = client.db(dbName);

        // Start the server after successful DB connection
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
})();

// --- CRUD Functions ---
// 1. Get all notes
app.get('/notes', async (req, res) => {
    try {
        const notes = await db.collection(collectionName).find().toArray();
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. Get a specific note
app.get('/notes/:id', async (req, res) => {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
    }

    try {
        const note = await db.collection(collectionName).findOne({ _id: new ObjectId(id) });
        if (!note) return res.status(404).json({ error: 'Note not found' });
        res.status(200).json(note);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. Create a new note
app.post('/notes', async (req, res) => {
    const { title, mainText } = req.body;

    if (!title || !mainText) {
        return res.status(400).json({ error: 'Title and MainText are required' });
    }

    const newNote = { title, mainText, lastModified: new Date() };

    try {
        const result = await db.collection(collectionName).insertOne(newNote);
        res.status(201).json(result.ops[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 4. Update a note
app.put('/notes/:id', async (req, res) => {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
    }

    const { title, mainText } = req.body;

    if (!title && !mainText) {
        return res.status(400).json({ error: 'At least one field must be provided for update' });
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
            return res.status(404).json({ error: 'Note not found' });
        }

        res.status(200).json({ message: 'Note updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 5. Delete a note
app.delete('/notes/:id', async (req, res) => {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
    }

    try {
        const result = await db.collection(collectionName).deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Note not found' });
        }

        res.status(200).json({ message: 'Note deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default app;
