import { sql } from './connect';
import { Session } from './sessions';

export type User = {
  id: number;
  username: string;
};
export type FullUser = User & {
  passwordHash: string;
};

export async function createUser(name: string, passwordHash: string) {
  const [user] = await sql<User[]>`
  INSERT INTO users
    (username, password_hash)
  VALUES(${name}, ${passwordHash})
  RETURNING
    id,
    username`;
  return user;
}

export async function getUserByUsername(username: User['username']) {
  if (!username) return undefined;
  const [user] = await sql<User[]>`
  SELECT
    id,
    username
  FROM
    users
  WHERE
    username = ${username}`;
  return user;
}
export async function getUserWithPasswordByUsername(
  username: User['username'],
) {
  if (!username) return undefined;
  const [user] = await sql<FullUser[]>`
  SELECT
    id,
    username,
    password_hash
  FROM
    users
  WHERE
    username = ${username}`;
  return user;
}

export async function getUserByToken(token: Session['token']) {
  if (!token) return undefined;
  console.log('token in function', token);
  const [user] = await sql<User[]>`
  SELECT
    users.id,
    users.username
  FROM
    users,
    sessions
  WHERE
    sessions.token = ${token}
    AND
    sessions.expiry_timestamp > now()
    AND
    sessions.user_id = users.id
  `;
  return user;
}

export async function getUserByPasswordHash(
  passwordHash: FullUser['passwordHash'],
) {
  if (!passwordHash) return undefined;
  const [user] = await sql<FullUser[]>`
  SELECT * FROM users
  WHERE
    password_hash = ${passwordHash}`;
  return user;
}
