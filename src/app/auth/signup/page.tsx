'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const router = useRouter();

  const handleSignup = async () => {
    const res = await fetch('/api/auth', {
      method: 'POST',
      body: JSON.stringify({ ...form, type: 'signup' }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      router.push('/auth/login');
    } else {
      alert(data.error || 'Signup failed');
    }
  };

  return (
    <>
    <Navbar></Navbar>
    <div className="p-6 max-w-md mx-auto">
      
      <h1 className="text-2xl font-bold mb-4">Add Admin</h1>
      <input
        className="w-full p-2 border mb-2"
        placeholder="Name"
        required
        onChange={e => setForm({ ...form, name: e.target.value })}
      />
      <input
        className="w-full p-2 border mb-2"
        type="email"
        required
        placeholder="Email"
        onChange={e => setForm({ ...form, email: e.target.value })}
      />
      <input
        className="w-full p-2 border mb-2"
        type="password"
        placeholder="Password"
        required
        onChange={e => setForm({ ...form, password: e.target.value })}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleSignup}
      >
        Add Admin
      </button>
    </div>
    </>
  );
}
