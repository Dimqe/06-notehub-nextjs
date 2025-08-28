'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import NoteList from '@/components/NoteList/NoteList';
import SearchBox from '@/components/SearchBox/SearchBox';
import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import css from './NotesPage.module.css';

export default function NotesClient() {
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 400); 

  const { data, isLoading, error } = useQuery({
    queryKey: ['notes', { q: debouncedSearch }],
    queryFn: () => debouncedSearch.trim() === '' ? Promise.resolve({ notes: [], totalPages: 1 }) : fetchNotes({ search: debouncedSearch }),
    enabled: debouncedSearch.trim() !== '',
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
