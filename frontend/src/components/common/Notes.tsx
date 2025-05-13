import React, { useState } from 'react';
import Button from './Button';

import { fetchWithAuthAndParse } from '../../utils/auth.utils';

export default function Notes({ onClose }: { onClose: () => void }) {
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNoteChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNote(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await fetchWithAuthAndParse<{ message?: string }>('/api/users/notes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note }),
      });
      setNote('');
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="absolute z-50 h-[320px] w-[320px] overflow-auto"
      style={{ minHeight: '240px', maxHeight: '90vh' }}
    >
      <form
        onSubmit={handleSubmit}
        className="flex h-full flex-col justify-between gap-1"
      >
        <textarea
          value={note}
          onChange={handleNoteChange}
          placeholder="Napiš poznámku..."
          className="color-disabled h-full w-full resize-none rounded-sm border p-2"
          rows={5}
          required
        />
        <div className="flex justify-between gap-1">
          <Button
            onClick={onClose}
            type="button"
            buttonColor="button-secondary"
            aria-label="Close"
          >
            Zavřít
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            Odeslat
          </Button>
        </div>
      </form>
    </div>
  );
}
