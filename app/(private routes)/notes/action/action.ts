'use server';

import { revalidatePath } from 'next/cache';
import { createNote } from '@/lib/api/clientApi';
import type { NoteTag } from '@/types/note';

export async function createNoteAction(formData: FormData) {
  const data = {
    title: formData.get('title') as string,
    content: formData.get('content') as string,
    tag: formData.get('tag') as NoteTag,
  };
    
  await createNote(data);
  revalidatePath('/notes');
}