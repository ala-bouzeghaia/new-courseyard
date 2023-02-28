import { fireEvent, render, screen } from '@testing-library/react';
import YouTube from 'react-youtube';
import Note from './Note';
import mockData from '../../__tests__/mockDataNotes.json';
import { formatTime } from '../../utils/helpers';

describe('Note', () => {
  const mockNote = mockData.noteList[0];
  it('should render a note', () => {
    render(
      <Note
        note={mockNote}
        saveNoteChanges={jest.fn()}
        deleteNote={jest.fn()}
        editNote={jest.fn()}
        isEditingNote={false}
        openNoteTextarea={false}
        playerRef={{} as React.MutableRefObject<YouTube>}
        textareaRef={{} as React.RefObject<HTMLTextAreaElement>}
      />,
    );
    const noteTimecode = screen.getByText(formatTime(mockNote.timecode));
    expect(noteTimecode).toBeInTheDocument();

    const noteContent = screen.getByText(mockNote.content);
    expect(noteContent).toBeInTheDocument();
  });

  it('should render note icons', () => {
    const editNote = jest.fn();
    render(
      <Note
        note={mockNote}
        saveNoteChanges={jest.fn()}
        deleteNote={jest.fn()}
        editNote={editNote}
        isEditingNote={false}
        openNoteTextarea={false}
        playerRef={{} as React.MutableRefObject<YouTube>}
        textareaRef={{} as React.RefObject<HTMLTextAreaElement>}
      />,
    );

    const noteEditIcon = screen.getByText('edit-note');
    expect(noteEditIcon).toBeInTheDocument();

    fireEvent.click(noteEditIcon);
    expect(editNote).toHaveBeenCalledTimes(1);

    const noteDeleteIcon = screen.getByText('delete-note');
    expect(noteDeleteIcon).toBeInTheDocument();
  });

  it('should render editing note icon', () => {
    const saveNote = jest.fn();
    render(
      <Note
        note={mockNote}
        saveNoteChanges={saveNote}
        deleteNote={jest.fn()}
        editNote={jest.fn()}
        isEditingNote={true}
        openNoteTextarea={true}
        playerRef={{} as React.MutableRefObject<YouTube>}
        textareaRef={{} as React.RefObject<HTMLTextAreaElement>}
      />,
    );

    const noteCheckIcon = screen.getByText('save-note');
    expect(noteCheckIcon).toBeInTheDocument();

    fireEvent.click(noteCheckIcon);
    expect(saveNote).toHaveBeenCalledTimes(1);

    const noteDeleteIcon = screen.getByText('delete-note');
    expect(noteDeleteIcon).toBeInTheDocument();
  });
});
