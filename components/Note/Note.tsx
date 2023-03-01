import YouTube from 'react-youtube';
import { HiOutlinePencil, HiOutlineTrash, HiOutlineCheckCircle } from 'react-icons/hi';
import styles from './Note.module.scss';
import { NoteType } from '../../types/note';
import { convertSecondsToTimecode } from '../../utils/helpers';

type Props = {
  note: NoteType;
  openNoteTextarea: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  playerRef: React.MutableRefObject<YouTube>;
  deleteNote: (id: string) => void;
  editNote: (noteToEdit: NoteType) => void;
  isEditingNote: boolean;
  saveNoteChanges: (id: string) => void;
};

const Note = (props: Props) => {
  return (
    <div className={styles.note}>
      <p
        className={styles.timecode}
        onClick={() => {
          props.playerRef.current.internalPlayer.seekTo(props.note.timecode);
        }}>
        {convertSecondsToTimecode(props.note.timecode)}
      </p>
      <p>{props.note.content}</p>
      <div>
        {props.isEditingNote && props.openNoteTextarea ? (
          <HiOutlineCheckCircle
            title="save-note"
            size={20}
            onClick={() => props.saveNoteChanges(props.note.id)}
          />
        ) : (
          <HiOutlinePencil title="edit-note" size={20} onClick={() => props.editNote(props.note)} />
        )}
        <HiOutlineTrash
          title="delete-note"
          size={20}
          onClick={() => props.deleteNote(props.note.id)}
        />
      </div>
    </div>
  );
};

export default Note;
