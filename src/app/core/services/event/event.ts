import { Injectable, signal } from '@angular/core';
type EventMap = Record<string, any>;
@Injectable({
  providedIn: 'root',
})
export class Event {

  private events = signal<EventMap>({});

  emit<T>(key: string, data?: T) {
    this.events.update(state => ({
      ...state,
      [key]: data
    }));
  }

  on<T>(key: string) {
    return () => this.events()[key] as T;
  }

  clear(key: string) {
    this.events.update(state => {
      const newState = { ...state };
      delete newState[key];
      return newState;
    });
  }
}