import { fireEvent, render, screen } from '@testing-library/react';
import YouTube from 'react-youtube';
import NoteList from './NoteList';
import mockDataNotes from '../../__tests__/mockDataNotes.json';
import { convertSecondsToTimecode } from '../../utils/helpers';

describe('NoteList', () => {
  beforeAll(() => {
    render(
      <NoteList currentTime={0} playerRef={{} as React.MutableRefObject<YouTube>} noteList={[]} />,
    );
    const openNoteSection = screen.getByText('Take a note').parentElement as HTMLElement;
    expect(openNoteSection).toBeInTheDocument();
    fireEvent.click(openNoteSection);
  });

  it('should open note section textarea', () => {
    const textarea = screen.getByRole('textbox', { hidden: true });
    expect(textarea).toBeInTheDocument();
  });

  it('should render a new note', () => {
    render(
      <NoteList currentTime={0} playerRef={{} as React.MutableRefObject<YouTube>} noteList={[]} />,
    );

    const textarea = screen.getByRole<HTMLTextAreaElement>('textbox', { hidden: true });
    fireEvent.change(textarea, { target: { value: 'test value' } });
    expect(textarea.value).toBe('test value');

    fireEvent.click(screen.getByText('Add New Note').parentElement as HTMLElement);

    const noteContent = screen.getByText('test value');
    expect(noteContent).toBeInTheDocument();
  });

  it('should render a list of new notes', () => {
    render(
      <NoteList currentTime={0} playerRef={{} as React.MutableRefObject<YouTube>} noteList={[]} />,
    );

    const textarea = screen.getByRole<HTMLTextAreaElement>('textbox', { hidden: true });
    fireEvent.change(textarea, { target: { value: 'note number 1' } });
    fireEvent.click(screen.getByText('Add New Note').parentElement as HTMLElement);

    fireEvent.change(textarea, { target: { value: 'note number 2' } });
    fireEvent.click(screen.getByText('Add New Note').parentElement as HTMLElement);

    expect(screen.getByText('note number 1')).toBeInTheDocument();
    expect(screen.getByText('note number 2')).toBeInTheDocument();
  });

  it('should render a list of new notes', () => {
    const mockNoteList = mockDataNotes.noteList;
    render(
      <NoteList
        currentTime={0}
        playerRef={{} as React.MutableRefObject<YouTube>}
        noteList={mockNoteList}
      />,
    );

    mockNoteList.forEach((mockNote) => {
      const noteTimecode = screen.getByText(convertSecondsToTimecode(mockNote.timecode));
      expect(noteTimecode).toBeInTheDocument();

      const noteContent = screen.getByText(mockNote.content);
      expect(noteContent).toBeInTheDocument();
    });
  });
});
