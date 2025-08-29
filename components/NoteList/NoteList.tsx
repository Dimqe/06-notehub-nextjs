'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNote } from '@/lib/api';
import type { Note } from '@/types/note';
import Link from 'next/link';

import css from './NoteList.module.css';

interface NoteListProps {
  notes: Note[];
  onEdit?: (note: Note) => void; 
}

const NoteList = ({ notes, onEdit }: NoteListProps) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const handleDelete = (id: number | string) => {
    mutate(id.toString());
  };

  return (
    <ul className={css.list}>
      {notes.length === 0 ? (
        <li>No notes found.</li>
      ) : (
        notes.map((note) => (
          <li className={css.listItem} key={note.id}>
            <h2 className={css.title}>{note.title}</h2>
            <p className={css.content}>{note.content}</p>
            <div className={css.footer}>
              <span className={css.tag}>{note.tag}</span>
              <div className={css.actions}>
                <Link href={`/notes/${note.id}`}>View details</Link>
                {onEdit && (
                  <button
                    className={css.button}
                    onClick={() => onEdit(note)}
                  >
                    Edit
                  </button>
                )}
                <button
                  className={css.button}
                  onClick={() => handleDelete(note.id)}
                  disabled={isPending}
                >
                  {isPending ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </li>
        ))
      )}
    </ul>
  );
};

export default NoteList;
