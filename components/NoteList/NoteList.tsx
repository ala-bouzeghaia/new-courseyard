import { useEffect, useRef, useState } from 'react';
import { CgNotes } from 'react-icons/cg';
import { BiPlusCircle, BiXCircle } from 'react-icons/bi';
import YouTube from 'react-youtube';
import { v4 as uuidv4 } from 'uuid';
import styles from './NoteList.module.scss';
import { NoteType } from '../../types/note';
import Note from '../Note';

type Props = {
  currentTime: number;
  playerRef: React.MutableRefObject<YouTube>;
  noteList: NoteType[];
};

const NoteList = (props: Props) => {
  const { currentTime, playerRef } = props;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [openNoteTextarea, setOpenNoteTextarea] = useState(false);
  const [noteList, setNoteList] = useState(props.noteList);
  const [isEditingNote, setIsEditingNote] = useState(false);

  const handleNoteTextarea = () => {
    setOpenNoteTextarea(!openNoteTextarea);
  };

  const handleSubmit = () => {
    const note = textareaRef.current?.value as string;
    const id: string = uuidv4();
    if (note) {
      setNoteList((prev) => [...prev, { id, timecode: currentTime, content: note }]);
      if (textareaRef.current !== null) textareaRef.current.value = '';
      setOpenNoteTextarea(false);
    }
  };

  const cancelNote = () => {
    if (textareaRef.current !== null) textareaRef.current.value = '';
    setOpenNoteTextarea(false);
  };

  const deleteNote = (id: string) => {
    setNoteList(noteList.filter((note) => note.id !== id));
  };

  const editNote = (noteToEdit: NoteType) => {
    if (!openNoteTextarea && !isEditingNote) {
      setIsEditingNote(true);
      setOpenNoteTextarea(true);
      if (textareaRef.current !== null) textareaRef.current.value = noteToEdit.content;
    } else {
      setIsEditingNote(false);
    }
  };

  const saveNoteChanges = (id: string) => {
    const newNote = textareaRef.current?.value as string;
    if (newNote.length !== 0) {
      setNoteList((prev: NoteType[]) =>
        prev.map((note) => (note.id === id ? { ...note, content: newNote } : note)),
      );
    }
    if (textareaRef.current !== null) textareaRef.current.value = '';
    setOpenNoteTextarea(false);
    setIsEditingNote(false);
  };

  useEffect(() => {
    if (!openNoteTextarea) {
      setIsEditingNote(false);
    }
  }, [openNoteTextarea]);

  return (
    <div className={styles['notes-container']}>
      <div className={styles['notes-input']}>
        <div>
          <p onClick={handleNoteTextarea}>
            <CgNotes size={20} />
            <span>Take a note</span>
          </p>
          <div
            className={`${styles.buttons} ${
              styles[openNoteTextarea ? 'show-buttons' : 'hide-buttons']
            }`}>
            <p onClick={handleSubmit}>
              <BiPlusCircle size={18} /> <span>Add New Note</span>
            </p>
            <p onClick={cancelNote}>
              <BiXCircle size={18} />
              <span>Cancel</span>
            </p>
          </div>
        </div>

        <textarea
          className={`${styles[openNoteTextarea ? 'open-textarea' : 'close-textarea']}`}
          ref={textareaRef}
        />
      </div>
      <div className={styles['notes-list']}>
        {noteList.map((note) => (
          <Note
            key={note.id}
            note={note}
            playerRef={playerRef}
            openNoteTextarea={openNoteTextarea}
            textareaRef={textareaRef}
            deleteNote={deleteNote}
            editNote={editNote}
            isEditingNote={isEditingNote}
            saveNoteChanges={saveNoteChanges}
          />
        ))}
      </div>
    </div>
  );
};

export default NoteList;
