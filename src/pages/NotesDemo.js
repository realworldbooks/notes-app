import React, {useState, useEffect } from 'react';

function NotesDemo() {

const [notes, setNotes] = useState([]);
const [title, setTitle] = useState('');
const [content, setContent] = useState('');
const [editing, setEditing] = useState(null);
const [editTitle, setEditTitle] = useState('');
const [editContent, setEditContent] = useState('');
const [noteId, setNoteId] = useState('');
const [fetchedNote, setFetchedNote] = useState(null);
const [fetchError, setFetchError] = useState('');

const API = 'http://localhost:4000/api/v1/notes';
//fetch notes from the backend on component mount
useEffect(() => {
    fetch(API)
    .then(response => response.json())
    .then(data => setNotes(data))
    .catch(error => console.error('Error fetching notes: ', error));
}, []);


const handleAdd = (e) => {
    e.preventDefault();
    if (!title || !content) return;
    const newNote = {title, content};
    fetch(API, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newNote),
    })
    .then(response => response.json())
    .then(createdNote => {
        setNotes([...notes, createdNote]);
        setTitle('');
        setContent('');
    })
    .catch(error => console.error('Error adding note: ', error));
};

const handleDelete = (id) => {
    fetch(`${API}/${id}`, {
        method: 'DELETE',
    })
    .then(() => {
        setNotes(notes.filter(note => note.id !== id));
        if (fetchedNote && fetchedNote.id === id) {
            setFetchedNote(null);
        }
    })
    .catch(error => console.error('Error deleting note: ', error))
};

const startEdit = (note) => {
    setEditing(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
};

const handleEdit = (e) => {
    e.preventDefault();
    const updatedNote = {title: editTitle, content: editContent};
    fetch(`${API}/${editing}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedNote),
    })
    .then(response => response.json())
    .then(updatedNote => {
        setNotes(notes.map(note => note.id === editing ? updatedNote : note));
        setEditing(null);
        setEditTitle('');
        setEditContent('');
    })
    .catch(error => console.error('Error editing note: ', error));
};

const handleGetById = () => {
    setFetchError('');
    setFetchedNote(null);
    if (!noteId) return;
    fetch(`${API}/${noteId}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Note not found');
        }
        return response.json();
    })
    .then(note => setFetchedNote(note))
    .catch(error => setFetchError(error.message));
};

const handleStartEditById = () => {
    setFetchError('');
    setFetchedNote(null);
    if (!noteId) return;

    fetch(`${API}/${noteId}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Note not found to edit');
        }
        return response.json();
    })
    .then(noteToEdit => startEdit(noteToEdit))
    .catch(error => setFetchError(error.message));
};

return (
    <div style={{maxWidth: 600, margin: '2rem auto', padding: 20, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #ccc'}}>
        <h2>Notes Demo</h2>
        <form onSubmit={handleAdd} style={{marginBottom: 20}}>
            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ width: '40%', marginRight: 8}}
            />
            <input
                type="text"
                placeholder="Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                style={{ width: '40%', marginRight: 8}}
            />
            <button type="submit">Add Note</button>
        </form>

    {/* Get, Update, Delete by Id */}
        <div style={{marginBottom: 20, background: '#f9f9f9', padding: 10, borderRadius: 6}}>
            <input
                type="number"
                placeholder="Note ID"
                value={noteId}
                onChange={(e) => setNoteId(e.target.value)}
                style={{ width: 80, marginRight: 8}}
            />
            <button onClick={handleGetById} style={{ marginRight: 8}}>Get By Id</button>
            <button onClick={handleStartEditById} style={{marginRight: 8}}>Edit By ID</button>
            <button onClick={() => handleDelete(Number(noteId))}>Delete By Id</button>
            {fetchError && <div style={{color: 'red', marginTop: 8}}>{fetchError}</div>}
            {fetchedNote && (
                <div style={{marginTop: 8, color: '#333'}}>
                    <strong>Note:</strong> {fetchedNote.title} - {fetchedNote.content}
                </div>
            )}
        </div>
        <ul style={{listStyle: 'none', padding: 0}}>
            {notes.map(note => (
                <li key={note.id} style={{marginBottom: 16, borderBotttom: '1px solid #eee', paddingBottom: 8}}>
                    {editing === note.id ? (
                        <form onSubmit={handleEdit}>
                            <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                style={{width: '30%', marginRight: 8}}
                            />
                            <input
                                type="text"
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                style={{width: '40%', marginRight: 8}}
                            />
                            <button type="submit">Save</button>
                            <button type="button" onClick={() => setEditing(null)} style={{marginLeft: 4}}>Cancel</button>
                        </form>
                    ) : (
                        <>
                            <strong>{note.title}</strong> : {note.content}
                            <button onClick={ () => startEdit(note)} style={{marginLeft: 8}}>Edit</button>
                            <button onClick={() => handleDelete(note.id)} style={{marginLeft: 4}}>Delete</button>
                        </>  
                    )}
                </li>
            ))}
        </ul>
        {/* Real-Time Notes Table */}
        <h3 style={{marginTop: 40}}>All Notes</h3>
        <table style={{width: '100%', borderCollapse: 'collapse', marginTop: 10, background: '#fafafa'}}>
            <thead>
                <tr style={{background: '#eee'}}>
                    <th style={{border: '1px solid #ccc', padding: 8}}>NoteId</th>
                    <th style={{border: '1px solid #ccc', padding: 8}}>Title</th>
                    <th style={{border: '1px solid #ccc', padding: 8}}>Content</th>
                </tr>
            </thead>
            <tbody>
                {notes.map(note => (
                    <tr key={note.id}>
                        <td style={{border: '1px solid #ccc', padding: 8}}>{note.id}</td>
                        <td style={{border: '1px solid #ccc', padding: 8}}>{note.title}</td>
                        <td style={{border: '1px solid #ccc', padding: 8}}>{note.content}</td>  
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
    );
}

export default NotesDemo;