import { useState } from 'react';
import { Note } from '../../../shared/types/dataTypes';
import Button from './Button';

interface NoteCardProps {
  onClose: () => void;
  onSend: (noteType: Note) => void;
  wordId: number;
}

export default function NoteCard({ onClose, onSend, wordId }: NoteCardProps) {
  const [note, setNote] = useState('');

  const handleSend = () => {
    if (note.trim().length > 0 && note.length <= 255) {
      const noteData: Note = {
        word_id: wordId,
        note: note,
      };
      console.log('Sending note:', noteData);
      onSend(noteData);
      setNote('');
      onClose();
    }
  };

  return (
    <div className="absolute top-[290px] left-1/2 z-50 flex -translate-x-1/2 transform items-center justify-center">
      <div className="color-secondary w-[320px] rounded-md p-1">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          maxLength={255}
          placeholder="napiš poznámku developerovi"
          className="h-24 w-full rounded-md border bg-white p-1"
        />
        <div className="flex justify-between gap-1">
          <Button onClick={onClose} className="rounded-l-md">
            Cancel
          </Button>
          <Button onClick={handleSend} className="rounded-r-md">
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
