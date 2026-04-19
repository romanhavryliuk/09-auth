'use server';

import { cookies } from 'next/headers';
import { nextServer } from './api';
import type { Note } from '@/types/note';
import type { User } from '@/types/user';

async function getCookieHeader(): Promise<string> {
  const cookieStore = await cookies();
  return cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join('; ');
}

export async function checkSession(): Promise<boolean> {
  const cookieHeader = await getCookieHeader();
  const { data } = await nextServer.get<{ success: boolean }>('/auth/session', {
    headers: { Cookie: cookieHeader },
  });
  return data.success;
}

export async function fetchNotes(params?: {
  page?: number;
  search?: string;
  tag?: string;
}): Promise<{ notes: Note[]; totalPages: number }> {
  const cookieHeader = await getCookieHeader();
  const { data } = await nextServer.get('/notes', {
    params: { ...params, perPage: 12 },
    headers: { Cookie: cookieHeader },
  });
  return data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const cookieHeader = await getCookieHeader();
  const { data } = await nextServer.get(`/notes/${id}`, {
    headers: { Cookie: cookieHeader },
  });
  return data;
}

export async function getMe(): Promise<User> {
  const cookieHeader = await getCookieHeader();
  const { data } = await nextServer.get('/users/me', {
    headers: { Cookie: cookieHeader },
  });
  return data;
}