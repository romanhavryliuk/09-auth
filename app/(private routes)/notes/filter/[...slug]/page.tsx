import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';
import NotesClient from './Notes.client';
import { fetchNotes } from '@/lib/api/serverApi';

interface PageProps {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function NotesFilterPage({ params, searchParams }: PageProps) {
  const awaitedParams = await params;
  const awaitedSearchParams = await searchParams;

  const tag = awaitedParams.slug?.[0] ?? '';
  const page = Number(awaitedSearchParams.page ?? '1');
  const search = awaitedSearchParams.search ?? '';

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', page, tag, search],
    queryFn: () => fetchNotes({ page, search, tag }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} initialPage={page} initialSearch={search} />
    </HydrationBoundary>
  );
}