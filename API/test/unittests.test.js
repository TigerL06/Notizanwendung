import request from 'supertest';
import server from '../server.js';

describe('Notes API', () => {
    let testNoteId;

    test('should create a new note', async () => {
        const res = await request(server)
            .post('/notes')
            .send({ title: 'Test Title', mainText: 'Test Main Text' });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.title).toBe('Test Title');
        expect(res.body.mainText).toBe('Test Main Text');

        testNoteId = res.body._id;
    });

    test('should get all notes', async () => {
        const res = await request(server).get('/notes');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('should get a specific note', async () => {
        const res = await request(server).get(`/notes/${testNoteId}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('_id', testNoteId);
    });

    test('should update a note', async () => {
        const res = await request(server)
            .put(`/notes/${testNoteId}`)
            .send({ title: 'Updated Title' });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message', 'Note updated');
    });

    test('should delete a note', async () => {
        const res = await request(server).delete(`/notes/${testNoteId}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message', 'Note deleted');
    });

    test('should return 404 for a non-existing note', async () => {
        const res = await request(server).get('/notes/64fbaac20000000000000000');
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('error', 'Note not found');
    });

    test('should return 400 for invalid ID format', async () => {
        const res = await request(server).get('/notes/invalid-id');
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error', 'Invalid ID');
    });
});
