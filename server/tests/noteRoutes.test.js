const request = require('supertest');
const express = require('express');
const notesRouter = require('../routes/notesRoute');

// Create a mock Express app for testing purposes
const app = express();
app.use(express.json());
app.use('/api/v1/notes', notesRouter);

describe('Notes API Endpoints', () => {
  let initialNotes = [];

  // Reset the notes array before each test
  beforeEach(() => {
    // We'll use a new array for each test to ensure they are isolated
    initialNotes = [
      { id: 1, title: 'Test Note 1', content: 'Content for test note 1' },
      { id: 2, title: 'Test Note 2', content: 'Content for test note 2' }
    ];

    // We re-import the module to get a fresh state, which is a common pattern for in-memory stores
    jest.resetModules();
    const freshNotesRouter = require('../routes/notesRoute');
    app._router.stack = app._router.stack.filter(layer => layer.name !== 'notesRouter');
    app.use('/api/v1/notes', freshNotesRouter);
  });

  // Test GET all notes
  test('GET /api/v1/notes should return all notes', async () => {
    const response = await request(app).get('/api/v1/notes');
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body[0].title).toBe('First Note');
  });

  // Test POST a new note
  test('POST /api/v1/notes should create a new note', async () => {
    const newNote = { title: 'New Test Note', content: 'Content of new note' };
    const response = await request(app)
      .post('/api/v1/notes')
      .send(newNote);

    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe(newNote.title);
    expect(response.body).toHaveProperty('id');
  });

  // Test POST with missing data
  test('POST /api/v1/notes with missing data should return 400', async () => {
    const badNote = { title: 'Bad Note' }; // Content is missing
    const response = await request(app)
      .post('/api/v1/notes')
      .send(badNote);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Title and content are required');
  });

  // Test GET a note by ID
  test('GET /api/v1/notes/:id should return a single note', async () => {
    const response = await request(app).get('/api/v1/notes/1');
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe('First Note'); // Assumes 'First Note' is in the initial state
  });

  // Test GET for a non-existent ID
  test('GET /api/v1/notes/:id with invalid id should return 404', async () => {
    const response = await request(app).get('/api/v1/notes/999');
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe('Note not found');
  });

  // Test PUT to update a note
  test('PUT /api/v1/notes/:id should update a note', async () => {
    const updatedData = { title: 'Updated Title', content: 'Updated Content' };
    const response = await request(app)
      .put('/api/v1/notes/1')
      .send(updatedData);

    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe('Updated Title');
  });
  
  // Test PUT with missing data
  test('PUT /api/v1/notes/:id with missing data should return 400', async () => {
    const badUpdate = { title: 'Bad Update' }; // Content is missing
    const response = await request(app)
      .put('/api/v1/notes/1')
      .send(badUpdate);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Title and content are required');
  });

  // Test DELETE a note
  test('DELETE /api/v1/notes/:id should delete a note', async () => {
    const response = await request(app).delete('/api/v1/notes/1');
    expect(response.statusCode).toBe(204);

    // Verify the note is gone by trying to retrieve it
    const getResponse = await request(app).get('/api/v1/notes/1');
    expect(getResponse.statusCode).toBe(404);
  });
});