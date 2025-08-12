import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import NotesDemo from '../pages/NotesDemo';

// Mock the fetch API
global.fetch = jest.fn((url, options) => {
  // Mock the initial GET request
  if (url.includes('/notes') && (!options || options.method === 'GET')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve([
        { id: 1, title: 'Mock Note', content: 'Mock Content' }
      ]),
    });
  }

  // Mock the POST request for a new note
  if (url.includes('/notes') && options?.method === 'POST') {
    const newNoteData = JSON.parse(options.body);
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ id: 2, ...newNoteData }),
    });
  }

  // Fallback for other requests
  return Promise.reject(new Error('Unknown API call in test'));
});

describe('NotesDemo Component', () => {
  test('renders and fetches initial notes', async () => {
    render(<NotesDemo />);
    // Check if initial notes are rendered after fetch
    await waitFor(() => {
      const notes = screen.getAllByText('Mock Note');
      expect(notes.length).toBe(2); 
    });
  });

  test('adds a new note', async () => {
    render(<NotesDemo />);
    
    // Simulate user input
    fireEvent.change(screen.getByPlaceholderText('Title'), { target: { value: 'New Note Title' } });
    fireEvent.change(screen.getByPlaceholderText('Content'), { target: { value: 'New Note Content' } });
    
    // Mock the POST request
    jest.spyOn(global, 'fetch').mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ id: 2, title: 'New Note Title', content: 'New Note Content' }),
      })
    );

    // Simulate button click
    fireEvent.click(screen.getByRole('button', { name: 'Add Note' }));

    // Check if the new note appears in the UI
    await waitFor(() => {
      // Find all the rows in the table
      const rows = screen.getAllByRole('row');
      
      // Get the last row (which should be our new note)
      const newNoteRow = rows[rows.length - 1];
      
      // Use the 'within' utility to find the cell in that specific row 
      const titleCell = within(newNoteRow).getByRole('cell', { name: 'New Note Title' });
      
      // Assert that the cell exists
      expect(titleCell).toBeInTheDocument();
    });
  });
});