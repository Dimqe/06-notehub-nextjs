import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import NoteDetailsClient from './NoteDetails.client';


 
  export default async function NoteDetailsPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
 

  const id = params.id;
  const qc = new QueryClient();
  await qc.prefetchQuery({ queryKey: ['note', id], queryFn: () => fetchNoteById(id) });

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}
