'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { registerApi } from '@/services/auth';
import { RegisterFormData } from '@/types/auth';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<RegisterFormData>({
    username: '',
    email: '',
    password: '',
    re_password: '',
    first_name: '',
    last_name: '',
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await registerApi(form);
      const result = await signIn('credentials', {
        username: form.username,
        password: form.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Registration successful but automatic login failed. Please sign in manually.');
        router.push('/login');
        return;
      }

      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.message ?? 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-black mb-1">Register</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Last name
              </label>
              <input
                type="text"
                value={form.last_name}
                onChange={handleChange}
                name="last_name"
                placeholder="Smith"
                className="w-full text-black rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                First name
              </label>
              <input
                type="text"
                value={form.first_name}
                onChange={handleChange}
                name="first_name"
                placeholder="John"
                className="w-full text-black rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={form.username}
              onChange={handleChange}
              name="username"
              placeholder="username"
              className="w-full text-black rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              name="email"
              placeholder="email@example.com"
              className="w-full text-black rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2  transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              required
              value={form.password}
              onChange={handleChange}
              name="password"
              placeholder="••••••••"
              className="w-full text-black rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              required
              value={form.re_password}
              onChange={handleChange}
              name="re_password"
              placeholder="••••••••"
              className="w-full text-black rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 transition"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black rounded-lg py-2.5 text-sm font-medium text-white disabled:opacity-60 transition"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link href="/login" className="text-black font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
