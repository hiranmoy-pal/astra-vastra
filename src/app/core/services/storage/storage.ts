import { Injectable } from '@angular/core';
import { openDB, IDBPDatabase } from 'idb';

@Injectable({
  providedIn: 'root',
})
export class Storage {

  private dbPromise: Promise<IDBPDatabase>;

  constructor() {
    this.dbPromise = this.initDB();
  }

  private async initDB() {
    if (typeof window === 'undefined') return null as any;

    return openDB('Astra-Vastra-db', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('keyval')) {
          db.createObjectStore('keyval');
        }
      },
    });
  }

  async set(key: string, value: any) {
    const db = await this.dbPromise;
    return db?.put('keyval', value, key);
  }

  async get<T>(key: string): Promise<T | null> {
    const db = await this.dbPromise;
    return db?.get('keyval', key);
  }

  async remove(key: string) {
    const db = await this.dbPromise;
    return db?.delete('keyval', key);
  }
}
