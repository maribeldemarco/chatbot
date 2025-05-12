import { Component, AfterViewInit } from '@angular/core';

declare var bootstrap: any;  // Para que Angular reconozca la clase de Bootstrap

@Component({
  selector: 'app-chat-bot',
  standalone: true,
  imports: [],
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.scss']  // Corregí el typo: "styleUrl" a "styleUrls"
})
export class ChatBotComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    // Acceder al modal usando el id
    const modalElement = document.getElementById('myModal');
    
    if (modalElement) {
      // Crear una instancia del modal de Bootstrap
      const modal = new bootstrap.Modal(modalElement);

      // Mostrar el modal
      modal.show();
    }
  }
}
