import chai from 'chai';
import chaiHttp from 'chai-http';
import { expect } from 'chai';
import server from '../server.js'; // Den Pfad anpassen, falls nötig

chai.use(chaiHttp);

describe('CRUD API Tests', () => {

    let testNoteId;

    it('should create a new note', (done) => {
        chai.request(server)
            .post('/notes')
            .send({ title: 'Test Title', mainText: 'Test Main Text' })
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.have.property('_id');
                expect(res.body.title).to.equal('Test Title');
                expect(res.body.mainText).to.equal('Test Main Text');
                testNoteId = res.body._id;
                done();
            });
    });

    it('should get all notes', (done) => {
        chai.request(server)
            .get('/notes')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array');
                done();
            });
    });

    it('should get a specific note', (done) => {
        chai.request(server)
            .get(`/notes/${testNoteId}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('_id').that.equals(testNoteId);
                expect(res.body.title).to.equal('Test Title');
                done();
            });
    });

    it('should update a note', (done) => {
        chai.request(server)
            .put(`/notes/${testNoteId}`)
            .send({ title: 'Updated Title' })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('message').that.equals('Note updated');
                done();
            });
    });

    it('should delete a note', (done) => {
        chai.request(server)
            .delete(`/notes/${testNoteId}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('message').that.equals('Note deleted');
                done();
            });
    });

    it('should return 404 for a non-existing note', (done) => {
        chai.request(server)
            .get('/notes/123456789012345678901234')
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res.body).to.have.property('error').that.equals('Note not found');
                done();
            });
    });

    it('should return 400 for invalid ID format', (done) => {
        chai.request(server)
            .get('/notes/invalid-id')
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('error').that.equals('Invalid ID');
                done();
            });
    });
});
