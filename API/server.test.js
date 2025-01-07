// server.test.js
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient, ObjectId } = require('mongodb');
const app = require('./server'); // Stelle sicher, dass du app exportierst

let mongoServer;
let db;
let client;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  db = client.db('notizdb');
  app.locals.db = db; // Datenbank an App anhängen
});

afterAll(async () => {
  await client.close();
  await mongoServer.stop();
});

describe('CRUD API Tests', () => {
  let noteId;

  test('POST /notes - sollte eine neue Notiz erstellen', async () => {
    const response = await request(app)
      .post('/notes')
      .send({ title: 'Test Titel', mainText: 'Test Text' });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.title).toBe('Test Titel');
    expect(response.body.mainText).toBe('Test Text');

    noteId = response.body._id;
  });

  test('GET /notes - sollte alle Notizen abrufen', async () => {
    const response = await request(app).get('/notes');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test('GET /notes/:id - sollte eine spezifische Notiz abrufen', async () => {
    const response = await request(app).get(`/notes/${noteId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('_id', noteId);
  });

  test('PUT /notes/:id - sollte eine Notiz aktualisieren', async () => {
    const response = await request(app)
      .put(`/notes/${noteId}`)
      .send({ title: 'Aktualisierter Titel' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Note updated');
  });

  test('DELETE /notes/:id - sollte eine Notiz löschen', async () => {
    const response = await request(app).delete(`/notes/${noteId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Note deleted');
  });
});
