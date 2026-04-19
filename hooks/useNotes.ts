// hooks/useNotes.ts
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { fetchNotes, deleteNote } from "@/lib/api/clientApi";

export const useNotes = (page: number, search: string) => {
  const queryClient = useQueryClient();

  const notesQuery = useQuery({
    queryKey: ["notes", page, search],
    queryFn: () => fetchNotes({ page, search }),
    placeholderData: keepPreviousData,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  return {
    notesQuery,
    deleteNote: deleteMutation.mutate,
  };
};