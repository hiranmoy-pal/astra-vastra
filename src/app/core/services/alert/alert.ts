import { Injectable, signal } from '@angular/core';

export interface AlertConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean; // Set to true for destructive actions like Delete/Logout
}

interface AlertState {
  config: AlertConfig | null;
  resolve: ((value: boolean) => void) | null;
}

@Injectable({
  providedIn: 'root',
})
export class Alert {
  private _alertState = signal<AlertState>({ config: null, resolve: null });

  // Expose as readonly signal for the template
  state = this._alertState.asReadonly();

  /**
   * Shows the alert and returns a Promise that resolves to true (Confirm) or false (Cancel).
   */
  show(config: AlertConfig): Promise<boolean> {
    return new Promise((resolve) => {
      this._alertState.set({ config, resolve });

      if (typeof document !== 'undefined') {
        document.body.classList.add('modal-open');
      }
    });
  }

  /**
   * Called by the UI when a button is clicked.
   */
  close(result: boolean) {
    const resolveFunc = this._alertState().resolve;
    if (resolveFunc) {
      resolveFunc(result); // Resolves the promise with true or false
    }

    // Reset state
    this._alertState.set({ config: null, resolve: null });

    if (typeof document !== 'undefined') {
      document.body.classList.remove('modal-open');
    }
  }
}