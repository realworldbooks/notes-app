const express = require('express');
const router = express.Router();
const { parse } = require("dotenv");

let notes = [
    {id: 1, title: 'First Note', content: 'My First Note'},
    {id: 2, title: 'Second Note', content: 'My Second Note'},
];
let nextId = 3;

//Create a new note
router.post('/', (req, res) => {
    const { title, content } = req.body;
    if(!title || !content) {
        return res.status(400).json({ message: 'Title and content are required' });
    }
    const note = {id: nextId++, title, content};
    notes.push(note);
    res.status(201).json(note);
});

// Get all notes
router.get('/', (req, res) => {
    res.json(notes); 
});

// Get Note By Id
router.get('/:id', (req, res) => {
    const note = notes.find(n => n.id === parseInt(req.params.id));
    if (!note) {
        return res.status(404).json({ message: 'Note not found' });
    }
    res.json(note);
});

// Update note by Id
router.put('/:id', (req, res) => {
    const note = notes.find(n => n.id === parseInt(req.params.id));
    if (!note) {
        return res.status(404).json({ message: 'Note not found' });
    }   
    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required' });
    }   
    note.title = title;
    note.content = content;
    res.json(note);
});
    
// Delete note by Id
router.delete('/:id', (req, res) => {
    const index = notes.findIndex(n => n.id === parseInt(req.params.id));
    if (index === -1) {
        return res.status(404).json({ message: 'Note not found' });
    }
notes.splice(index, 1);
res.status(204).send();
});

module.exports = router;


