"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";
import SearchBox from "@/components/SearchBox/SearchBox";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import css from "./NotesPage.module.css";
import type { Note } from "@/types/note";

export default function NotesClient() {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 400);
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const queryClient = useQueryClient();

  
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ["notes", { q: debouncedSearch, page }],
    queryFn: () => fetchNotes({ search: debouncedSearch, page }),
    staleTime: 1000 * 60,
    placeholderData: (prev) => prev, 
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  const openNewNote = () => {
    setEditingNote(null);
    setIsModalOpen(true);
  };

  const openEditNote = (note: Note) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleNoteSaved = async () => {
    closeModal();
    await queryClient.invalidateQueries({ queryKey: ["notes"] });
  };

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

  if (isLoading) return <p>Loading, please wait...</p>;
  if (error) return <p>Could not fetch the list of notes.</p>;

  return (
    <div className={css.app}>
      <div className={css.controls}>
        <SearchBox value={search} onChange={setSearch} />
        <button type="button" onClick={openNewNote} className={css.newButton}>
          + New note
        </button>
      </div>

      <NoteList notes={notes} onEdit={openEditNote} />

      <div className={css.pagination}>
        <button type="button" onClick={handlePrev} disabled={page <= 1}>
          Prev
        </button>
        <span className={css.pageInfo}>
          Page {page} {totalPages > 1 ? `of ${totalPages}` : ""}
        </span>
        <button
          type="button"
          onClick={handleNext}
          disabled={page >= totalPages}
        >
          Next
        </button>
      </div>

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm
            note={editingNote ?? undefined}
            onSuccess={handleNoteSaved}
            onClose={closeModal}
          />
        </Modal>
      )}
    </div>
  );
}
