'use server';

import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { User } from '@/components/UsersTableClient';

const DATA_FILE = path.join(process.cwd(), 'data.json');

async function getUsers(): Promise<User[]> {
  const jsonData = await fs.readFile(DATA_FILE, 'utf-8');
  return JSON.parse(jsonData);
}

async function saveUsers(users: User[]) {
  await fs.writeFile(DATA_FILE, JSON.stringify(users, null, 2));
}

export async function deleteUserAction(userId: string) {
  try {
    const users = await getUsers();
    const filteredUsers = users.filter((u) => u.id !== userId);
    await saveUsers(filteredUsers);
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete user:', error);
    return { success: false, error: 'Failed to delete user' };
  }
}

export async function addUserAction(formData: Omit<User, 'id'>) {
  try {
    const users = await getUsers();
    const newUser: User = {
      ...formData,
      id: crypto.randomUUID(),
    };
    const updatedUsers = [newUser, ...users];
    await saveUsers(updatedUsers);
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to add user:', error);
    return { success: false, error: 'Failed to add user' };
  }
}
