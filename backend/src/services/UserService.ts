// ✅ NO IMPORTS - Self-contained service
// This is a basic CRUD service for users

interface IUser {
  id?: string;
  email: string;
  password: string;
  role: 'admin' | 'customer';
  status?: 'ACTIVE' | 'SUSPENDED';
}

/******************************************************************************
                                Constants
******************************************************************************/

export const USER_NOT_FOUND_ERR = 'User not found';

/******************************************************************************
                                Functions
******************************************************************************/

/**
 * Get all users.
 */
async function getAll(): Promise<IUser[]> {
  // TODO: Implement with your database
  return [];
}

/**
 * Add one user.
 */
async function addOne(user: IUser): Promise<void> {
  // TODO: Implement with your database
}

/**
 * Update one user.
 */
async function updateOne(user: IUser): Promise<void> {
  // TODO: Implement with your database
  if (!user.id) {
    throw new Error(USER_NOT_FOUND_ERR);
  }
}

/**
 * Delete a user by their id.
 */
async function _delete(id: string): Promise<void> {
  // TODO: Implement with your database
}

/******************************************************************************
                                Export default
******************************************************************************/

export default {
  getAll,
  addOne,
  updateOne,
  delete: _delete,
} as const;