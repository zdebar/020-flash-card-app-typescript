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
    if (note.trim().length > 0) {
      const noteData: Note = {
        word_id: wordId,
        note: note,
      };
      onSend(noteData);
      setNote('');
      onClose();
    }
  };

  return (
    <div className="color-secondary absolute top-[285px] left-1/2 z-50 flex w-[320px] -translate-x-1/2 flex-col justify-end gap-1 rounded-b-md p-1">
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        maxLength={255}
        placeholder="napiš poznámku developerovi"
        className="h-32 w-full rounded-md border bg-white p-1"
      />
      <div className="flex w-full justify-between gap-1 p-0">
        <Button onClick={onClose} className="rounded-l-md">
          Cancel
        </Button>
        <Button onClick={handleSend} className="rounded-r-md">
          Send
        </Button>
      </div>
    </div>
  );
}
