import { uuidv7 } from "uuidv7";

/**
 * All primary keys are UUIDv7, generated here in the application layer.
 * Postgres has no native uuidv7() function yet (see uuidticket-schema.dbml
 * design notes), so every service that inserts a row calls this instead of
 * relying on a DB default.
 */
export function newId(): string {
  return uuidv7();
}
