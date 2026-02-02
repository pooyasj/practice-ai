import React from 'react';
import fs from 'fs/promises';
import path from 'path';
import { UsersTableClient, User } from './UsersTableClient';

export const UsersTable = async () => {
  const filePath = path.join(process.cwd(), 'data.json');
  const jsonData = await fs.readFile(filePath, 'utf-8');
  const users: User[] = JSON.parse(jsonData);

  return (
    <UsersTableClient initialUsers={users} />
  );
};
