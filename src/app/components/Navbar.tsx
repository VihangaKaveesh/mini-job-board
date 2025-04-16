'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    const confirmed = window.confirm('Are you sure you want to log out?');
    if (!confirmed) return;
  
    localStorage.removeItem('token');
    setLoggedIn(false);

    
    router.push('/');
    alert('Successfully logged out!');
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Mini Job Board</h1>
      <div className="space-x-4">
        {!loggedIn ? (
          pathname === '/auth/login' ? (
            <button onClick={() => router.push('/')} className="hover:underline">
              Back to Home
            </button>
          ) : (
            <button onClick={() => router.push('/auth/login')} className="hover:underline">
              Login
            </button>
          )
        ) : (
          <>
            <button onClick={() => router.push('/admin/dashboard')} className="hover:underline">
              Jobs
            </button>
            <button onClick={() => router.push('/auth/signup')} className="hover:underline">
              Add Admin
            </button>
            <button onClick={handleLogout} className="hover:underline text-red-300">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
