import { Entity } from 'dexie'
import type { AppDB } from './app-db'

export class GameModel extends Entity<AppDB> {
  id!: number;
  name!: string;
  data!: Uint8Array;
}
