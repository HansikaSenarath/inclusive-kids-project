import type { AACBoard, ChildProfile, ContentItem, ProgressLog } from '@/types';

const API_BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) || 'http://localhost:4000/api';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const body = await response.json();
      if (body?.message) message = body.message;
    } catch {
      // response had no JSON body, keep default message
    }
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export const api = {
  profiles: {
    list: () => request<ChildProfile[]>('/profiles'),
    get: (id: string) => request<ChildProfile>(`/profiles/${id}`),
    create: (payload: Partial<ChildProfile>) =>
      request<ChildProfile>('/profiles', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    update: (id: string, payload: Partial<ChildProfile>) =>
      request<ChildProfile>(`/profiles/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      }),
    remove: (id: string) =>
      request<void>(`/profiles/${id}`, {
        method: 'DELETE',
      }),
  },
  content: {
    list: () => request<ContentItem[]>('/content'),
    get: (id: string) => request<ContentItem>(`/content/${id}`),
  },
  progress: {
    list: (childId?: string) =>
      request<ProgressLog[]>(childId ? `/progress?child_id=${childId}` : '/progress'),
    create: (payload: Partial<ProgressLog>) =>
      request<ProgressLog>('/progress', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
  },
  aacBoards: {
    list: (childId?: string) =>
      request<AACBoard[]>(childId ? `/aac-boards?child_id=${childId}` : '/aac-boards'),
    create: (payload: Partial<AACBoard>) =>
      request<AACBoard>('/aac-boards', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    update: (id: string, payload: Partial<AACBoard>) =>
      request<AACBoard>(`/aac-boards/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      }),
  },
};
