'use client';

import React from 'react';
import { Trash2 } from 'lucide-react';

export const UserActions = () => {
  return (
    <div className="flex justify-end">
      <button
        type="button"
        aria-label="Delete user"
        className="text-red-500 hover:text-red-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-md p-1"
        onClick={() => {
          // No logic required per instructions
        }}
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
};
