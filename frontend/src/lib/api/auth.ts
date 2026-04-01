const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export type RegisterPayload = {
  email: string;
  password: string;
  re_password: string;
  username?: string;
  first_name?: string;
  last_name?: string;
};

export async function registerApi(payload: RegisterPayload): Promise<void> {
  const res = await fetch(`${BASE_URL}/auth/users/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    const firstError = Object.values(data)?.[0];
    const msg = Array.isArray(firstError) ? firstError[0] : 'Registration failed';
    throw new Error(msg as string);
  }
}


export async function authFetch(
  url: string,
  accessToken: string,
  options: RequestInit = {}
): Promise<Response> {
  const defaultHeaders: HeadersInit = {
    Authorization: `JWT ${accessToken}`,
  };

  if (!(options.body instanceof FormData)) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  const headers = {
    ...defaultHeaders,
    ...(options.headers ?? {}),
  };

  const res = await fetch(`${BASE_URL}${url}`, { ...options, headers });
  return res;
}