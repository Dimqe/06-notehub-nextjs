'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import NoteList from '@/components/NoteList/NoteList';
import SearchBox from '@/components/SearchBox/SearchBox';
import { useState } from 'react';
import css from './NotesPage.module.css';

export default function NotesClient() {
  const [search, setSearch] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['notes', { q: search }],
    queryFn: () => fetchNotes({ search }),
  });

  if (isLoading) return <p>Loading, please wait...</p>;
  if (error) return <p>Could not fetch the list of notes.</p>;

  return (
    <div className={css.app}>
      <SearchBox value={search} onChange={setSearch} />
      <NoteList notes={data?.notes ?? []} />
    </div>
  );
}
