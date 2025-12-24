'use client';

import { useSession } from 'next-auth/react';

export default function TestSessionPage() {
  const { data: session, status } = useSession();

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Session Debug Page</h1>
      
      <div className="bg-gray-100 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Status:</h2>
        <p className="mb-4">
          <strong>Loading:</strong> {status === 'loading' ? 'Yes' : 'No'}
        </p>
        <p className="mb-4">
          <strong>Status:</strong> {status}
        </p>
        
        <h2 className="text-xl font-semibold mb-4 mt-6">Session Data:</h2>
        {session ? (
          <div className="space-y-2">
            <p><strong>Name:</strong> {session.user?.name || 'N/A'}</p>
            <p><strong>Email:</strong> {session.user?.email || 'N/A'}</p>
            <p><strong>Is Admin:</strong> {session.user?.isAdmin ? 'YES ✅' : 'NO ❌'}</p>
            <p><strong>Provider:</strong> {session.user?.provider || 'N/A'}</p>
            
            <h3 className="text-lg font-semibold mt-4 mb-2">Full Session Object:</h3>
            <pre className="bg-white p-4 rounded overflow-auto text-xs">
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>
        ) : (
          <p className="text-gray-600">No active session. Please sign in.</p>
        )}
      </div>
    </div>
  );
}
