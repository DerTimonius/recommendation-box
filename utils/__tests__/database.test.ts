/**
 * @jest-environment node
 */

import {
  createUser,
  deleteUserById,
  getUserByUsername,
} from '../../database/user';

test('create, get and delete a user', async () => {
  const username = 'test_user';
  const password = 'test_user';
  expect(await getUserByUsername(username)).toBe(undefined);
  const testUser = await createUser(username, password);
  if (testUser) {
    expect(testUser.preferences).toBe(false);
    expect(await deleteUserById(testUser.id)).not.toBe(undefined);
  }
  expect(await getUserByUsername(username)).toBe(undefined);
});
