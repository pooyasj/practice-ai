import React from 'react';
import { UsersTable } from '@/components/UsersTable';

const UsersPage = () => {
  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-400 tracking-tight">Users</h1>
        <p className="text-sm text-gray-400">Managing user accounts</p>
      </div>
      
      <UsersTable />
    </div>
  );
};

export default UsersPage;