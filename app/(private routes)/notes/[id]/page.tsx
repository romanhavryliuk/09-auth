// app/notes/[id]/page.tsx
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import type { Metadata } from 'next';
import type { Note } from '@/types/note';
import { fetchNoteById } from "@/lib/api";
import NoteDetailsClient from "./NoteDetails.client";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const note: Note = await fetchNoteById(id);

    const title = `${note.title} - NoteHub`;
    const description = note.content.slice(0, 150);

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `https://08-zustand-gold-chi.vercel.app/notes/${id}`,
        images: [
          {
            url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
            width: 1200,
            height: 630,
            alt: note.title,
          },
        ],
      },
    };
  } catch {
    return {
      title: 'Note not found - NoteHub',
      description: 'This note does not exist or is unavailable.',
      openGraph: {
        title: 'Note not found - NoteHub',
        description: 'This note does not exist or is unavailable.',
        url: `https://08-zustand-gold-chi.vercel.app/notes/${id}`,
        images: [
          {
            url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
            width: 1200,
            height: 630,
            alt: 'Note not found',
          },
        ],
      },
    };
  }
}

const NoteDetails = async ({ params }: Props) => {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
};

export default NoteDetails;
