import { API_BASE_URL } from "../config";

export async function apiGet<T>(path: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`);

    if (!response.ok) {
        throw new Error(`GET ${path} failed with status ${response.status}`)
    }

    return response.json();
}

export async function apiPost<TBody, TResponse>(
    path: string,
    body: TBody,
) : Promise<TResponse> {
    const response  = await fetch(`${API_BASE_URL}${path}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`POST ${path} failed with status ${response.status}: ${text}`);
    }

    return response.json();
}