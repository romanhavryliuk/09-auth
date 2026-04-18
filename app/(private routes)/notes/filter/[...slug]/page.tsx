import NotesClient from "./Notes.client";
import { fetchNotes } from "@/lib/api";
import type { Metadata } from 'next';
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";

interface NotesFiltersProps {
    params: Promise<{ slug: string[] }>
    searchParams: Promise<{ page?: string; search?: string }>;
}

async function NotesFilters({
  params,
  searchParams,
}: NotesFiltersProps) {
  const { slug } = await params;
  const { page, search } = await searchParams;
  const category = slug?.[0] === "all" ? undefined : slug?.[0];
  const currentPage = Number(page ?? "1");

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", currentPage, search, category],
    queryFn: () =>
      fetchNotes({ page: currentPage, perPage: 12, search, tag: category }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={category} />
    </HydrationBoundary>
  );
}

export async function generateMetadata({ params }: NotesFiltersProps): Promise<Metadata> {
  const { slug } = await params;
  const filter = slug?.join(' / ') || 'All';

  const title = `${filter} notes | NoteHub`;
  const description = `Browse notes filtered by: ${filter}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://08-zustand-gold-chi.vercel.app/notes/filter/${slug.join('/')}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
  };
}

export default NotesFilters;