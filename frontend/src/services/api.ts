/**
 * REST API client for Cynbit Smart Discovery & Cost Estimator.
 */

import type { ApiResponse, ProjectInquiryPayload } from '../types';

const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  ''
).replace(/\/+$/, '');

export async function submitProjectInquiry(
  payload: ProjectInquiryPayload,
): Promise<ApiResponse> {
  const url = `${API_BASE_URL}/api/projects`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = (await res.json()) as ApiResponse;

    if (!res.ok) {
      const errMsg =
        data.message ||
        (data.errors && data.errors.map((e) => e.msg || e.message).join(', ')) ||
        `Request failed with status ${res.status}`;
      return {
        success: false,
        message: errMsg,
        errors: data.errors,
      };
    }

    return data;
  } catch (err) {
    const errorMsg =
      err instanceof Error ? err.message : 'Network error: could not connect to server.';
    return {
      success: false,
      message: errorMsg,
    };
  }
}

export async function checkApiHealth(): Promise<{ status: string; database: string }> {
  const url = `${API_BASE_URL}/api/health`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return {
      status: data.status || 'ok',
      database: data.database || 'unknown',
    };
  } catch {
    return {
      status: 'offline',
      database: 'disconnected',
    };
  }
}

