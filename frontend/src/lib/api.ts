/**
 * REST API client.
 *
 * The base URL comes from VITE_API_BASE_URL (see .env.example). When it is
 * empty the Vite dev proxy forwards /api to http://localhost:5000, so no
 * secrets or absolute URLs are baked into the bundle.
 */
import type { ApiErrorBody, ApiSuccessBody, ProjectInquiryPayload, ProjectRecord } from '../types';

const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '');

/** Thrown for any non-2xx response or network failure. */
export class ApiError extends Error {
  readonly status: number;
  readonly fieldErrors: Array<{ field: string; message: string }>;

  constructor(message: string, status: number, fieldErrors: Array<{ field: string; message: string }> = []) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${path}`;

  let response: Response;
  try {
    response = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...(options.headers ?? {}) },
      ...options,
    });
  } catch {
    // Fetch only rejects on network-level failures (offline, DNS, CORS, server down).
    throw new ApiError(
      'We could not reach the server. Please check your connection and try again.',
      0,
    );
  }

  const contentType = response.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');
  const body = isJson ? ((await response.json()) as unknown) : null;

  if (!response.ok) {
    const errorBody = body as ApiErrorBody | null;

    // 5xx: the server (or the dev proxy) is unreachable or broken. This is the
    // message users see when the backend is down, so keep it actionable.
    if (response.status >= 500) {
      throw new ApiError(
        'The server is unavailable right now. Your answers are safe - please try again in a moment.',
        response.status,
      );
    }

    throw new ApiError(
      errorBody?.message ?? `Request failed with status ${response.status}.`,
      response.status,
      errorBody?.errors ?? [],
    );
  }

  return (body as ApiSuccessBody<T>).data;
}

/** POST /api/projects - stores a project inquiry. */
export async function submitProjectInquiry(
  payload: ProjectInquiryPayload,
): Promise<ProjectRecord> {
  return request<ProjectRecord>('/api/projects', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/** GET /api/projects - admin-only listing (requires the admin bearer token). */
export async function listProjectInquiries(adminToken: string): Promise<ProjectRecord[]> {
  const data = await request<ProjectRecord[]>('/api/projects', {
    method: 'GET',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  return data;
}

/** GET /api/health - used to show a clear message when the backend is down. */
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/api/health`);
    return response.ok;
  } catch {
    return false;
  }
}
