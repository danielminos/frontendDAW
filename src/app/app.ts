import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  imports: [RouterOutlet, ToastModule],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
  providers: [MessageService]
})
export class App {
  protected readonly title = signal('frontend');
}
