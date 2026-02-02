'use client';

import React, { useState, useRef, useMemo, useTransition, useEffect } from 'react';
import { Trash2, ChevronUp, ChevronDown, UserPlus } from 'lucide-react';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { AddUserModal } from './AddUserModal';
import { deleteUserAction, addUserAction } from '@/lib/actions';

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'editor' | 'user';
  status: 'active' | 'inactive' | 'banned';
}

interface UsersTableClientProps {
  initialUsers: User[];
}

type SortDirection = 'asc' | 'desc' | 'none';

export const UsersTableClient = ({ initialUsers }: UsersTableClientProps) => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isPending, startTransition] = useTransition();

  // Keep state in sync with initialUsers from server
  useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortDirection, setSortDirection] = useState<SortDirection>('none');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  
  // To return focus to the button that opened the modal
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const addBtnRef = useRef<HTMLButtonElement | null>(null);

  const handleDeleteClick = (user: User, event: React.MouseEvent<HTMLButtonElement>) => {
    triggerRef.current = event.currentTarget;
    setUserToDelete(user);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setIsAddModalOpen(true);
  };

  const handleConfirmAdd = async (newUser: Omit<User, 'id'>) => {
    // Optimistic UI update
    const tempId = `temp-${Date.now()}`;
    const optimisticUser: User = { ...newUser, id: tempId };
    
    setUsers(prevUsers => [optimisticUser, ...prevUsers]);
    
    startTransition(async () => {
      const result = await addUserAction(newUser);
      if (!result.success) {
        // Rollback on failure
        setUsers(prevUsers => prevUsers.filter(u => u.id !== tempId));
        alert('Failed to add user');
      }
    });
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      const userId = userToDelete.id;
      // Optimistic UI update
      const originalUsers = users;
      setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
      
      startTransition(async () => {
        const result = await deleteUserAction(userId);
        if (!result.success) {
          // Rollback on failure
          setUsers(originalUsers);
          alert('Failed to delete user');
        }
      });
      setUserToDelete(null);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Return focus to the trigger button
    if (triggerRef.current) {
      triggerRef.current.focus();
    }
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    if (addBtnRef.current) {
      addBtnRef.current.focus();
    }
  };

  const handleSort = () => {
    setSortDirection((prev) => {
      if (prev === 'none') return 'asc';
      if (prev === 'asc') return 'desc';
      return 'none';
    });
  };

  const filteredAndSortedUsers = useMemo(() => {
    const query = searchQuery.toLowerCase();
    
    // First filter
    const filtered = users.filter((user) => {
      return (
        user.username.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query) ||
        user.status.toLowerCase().includes(query)
      );
    });

    // Then sort
    if (sortDirection === 'none') {
      return filtered;
    }

    return [...filtered].sort((a, b) => {
      const aVal = a.username.toLowerCase();
      const bVal = b.username.toLowerCase();
      
      if (sortDirection === 'asc') {
        return aVal.localeCompare(bVal);
      } else {
        return bVal.localeCompare(aVal);
      }
    });
  }, [users, searchQuery, sortDirection]);

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="relative flex-1 sm:max-w-xs">
          <label htmlFor="user-search" className="sr-only">
            Search users
          </label>
          <input
            id="user-search"
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        <button
          ref={addBtnRef}
          onClick={handleAddClick}
          className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm shrink-0 min-h-[42px] min-w-[44px]"
          aria-label="Add new user"
        >
          <UserPlus className="w-5 h-5" />
          <span className="font-semibold text-sm hidden sm:inline">Add User</span>
        </button>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-gray-200 sm:rounded-lg overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="min-w-full divide-y divide-gray-200 table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 cursor-pointer hover:bg-gray-100 transition-colors duration-150"
                  onClick={handleSort}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSort();
                    }
                  }}
                  tabIndex={0}
                  aria-sort={sortDirection === 'asc' ? 'ascending' : sortDirection === 'desc' ? 'descending' : 'none'}
                >
                  <div className="flex items-center space-x-1">
                    <span>Username</span>
                    <span className="inline-flex w-4 h-4 items-center justify-center">
                      {sortDirection === 'asc' && <ChevronUp className="w-4 h-4" aria-hidden="true" />}
                      {sortDirection === 'desc' && <ChevronDown className="w-4 h-4" aria-hidden="true" />}
                    </span>
                  </div>
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
                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredAndSortedUsers.length > 0 ? (
                filteredAndSortedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-150">
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
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          aria-label="Delete user"
                          className="text-red-500 hover:text-red-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-md p-1"
                          onClick={(e) => handleDeleteClick(user, e)}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500">
                    No users found matching &quot;{searchQuery}&quot;
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        username={userToDelete?.username || ''}
      />

      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onAdd={handleConfirmAdd}
      />
    </>
  );
};
