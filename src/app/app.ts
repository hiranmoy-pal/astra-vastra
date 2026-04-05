import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toast } from './core/services/toast/toast';
import { CommonModule } from '@angular/common';
import { Loading } from './core/services/loading/loading';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('AstraVastra');

  constructor( 
    public toastService: Toast,
    public loadingService: Loading
  ){

  }
}
