import React from 'react';
import fs from 'fs/promises';
import path from 'path';

interface User {
  username: string;
  email: string;
  role: 'admin' | 'editor' | 'user';
  status: 'active' | 'inactive' | 'banned';
}

export const UsersTable = async () => {
  const filePath = path.join(process.cwd(), 'data.json');
  const jsonData = await fs.readFile(filePath, 'utf-8');
  const users: User[] = JSON.parse(jsonData);

  return (
    <div className="overflow-hidden bg-white shadow-sm ring-1 ring-gray-200 sm:rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
              Username
            </th>
            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
              Email
            </th>
            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
              Role
            </th>
            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {users.map((user) => (
            <tr key={user.username} className="hover:bg-gray-50 transition-colors duration-150">
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                {user.username}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {user.email}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                <span className="capitalize">{user.role}</span>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                  user.status === 'active' ? 'bg-green-100 text-green-800' :
                  user.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {user.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
