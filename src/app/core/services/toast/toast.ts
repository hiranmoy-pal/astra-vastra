import { Injectable, signal } from '@angular/core';

export interface ToastModel {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({
  providedIn: 'root',
})
export class Toast {


  private _toasts = signal<ToastModel[]>([]);
  toasts = this._toasts.asReadonly();

  show(message: string, type: ToastModel['type'] = 'info') {
    const id = Date.now();
    this._toasts.update(t => [...t, { id, message, type }]);
    setTimeout(() => this.remove(id), 3000);
  }

  remove(id: number) {
    this._toasts.update(t => t.filter(x => x.id !== id));
  }
}