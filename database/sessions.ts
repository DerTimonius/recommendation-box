import { sql } from './connect';
import { User } from './user';

export type Session = {
  token: string;
  csrf_secret: string;
  id: number;
};

export async function createSession(
  userId: User['id'],
  token: Session['token'],
  secret: Session['csrf_secret'],
): Promise<Session> {
  const [session] = await sql<Session[]>`
  INSERT INTO sessions
    (token, user_id, csrf_token)
  VALUES
    (${token}, ${userId}, ${secret})
  RETURNING
    token,
    user_id,
    csrf_token
  `;
  await deleteExpiredSessions();
  return session!;
}

export async function getSessionByToken(token: Session['token']) {
  if (!token) return undefined;
  const [session] = await sql<Session[]>`
  SELECT
    token,
    user_id,
    csrf_token
  FROM
    sessions
  WHERE token = ${token}`;
  return session;
}

async function deleteExpiredSessions() {
  const sessions = await sql<Session[]>`
  DELETE FROM
    sessions
  WHERE
    expiry_timestamp < now()
  RETURNING
    id,
    token,
    csrf_token`;
  return sessions;
}

export async function deleteSessionByToken(token: Session['token']) {
  const [session] = await sql<Session[]>`
  DELETE FROM
    sessions
  WHERE
    sessions.token = ${token}
  RETURNING
    id,
    token,
    csrf_token`;
  return session;
}
