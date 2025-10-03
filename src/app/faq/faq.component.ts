import { Component, ViewChild, ElementRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [
    MatCardModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent {
  mensajes: { text: string; sender: 'user' | 'ai' }[] = [];
  mensajeActual: string = '';
  isLoading: boolean = false;

  @ViewChild('chatHistorial') chatHistorial!: ElementRef;

  constructor(private router: Router,  private http: HttpClient) {
    this.mensajes.push({
      text: '¡Hola! Soy el asistente virtual. ¿En qué puedo ayudarte hoy? Puedes preguntarme por nuestro horario, dirección o teléfono.',
      sender: 'ai'
    });
  }

  cerrarChat() {
    this.router.navigate(['/home']);
  }

  async enviarMensaje() {
    if (!this.mensajeActual.trim() || this.isLoading) return;

    const nuevoMensajeUsuario = { text: this.mensajeActual, sender: 'user' as const };
    this.mensajes.push(nuevoMensajeUsuario);
    this.mensajeActual = '';
    this.isLoading = true;
    this.scrollToBottom();

    try {
      const respuestaIA = await this.llamarBackendChat(nuevoMensajeUsuario.text);
      const nuevoMensajeIA = { text: respuestaIA, sender: 'ai' as const };
      this.mensajes.push(nuevoMensajeIA);
      this.scrollToBottom();
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
      this.mensajes.push({ text: "Disculpa, hubo un error. Intenta de nuevo más tarde.", sender: 'ai' });
      this.scrollToBottom();
    } finally {
      this.isLoading = false;
    }
  }
scrollToBottom() {
  if (this.chatHistorial) {
    setTimeout(() => {
      this.chatHistorial.nativeElement.scrollTop = this.chatHistorial.nativeElement.scrollHeight;
    }, 0);
  }
}

private async llamarBackendChat(userMessage: string): Promise<string> {
  const backendUrl = `${environment.apiUrl}/api/chat`;
  
  try {
    const response = await this.http.post<{ reply: string }>(
      backendUrl,
      { message: userMessage }
    ).toPromise();
    
    return response?.reply || 'No se recibió respuesta del servidor.';
  } catch (error: any) {
    console.error('Error al comunicarse con el backend:', error);
    
    if (error.status === 0) {
      return 'No se pudo conectar con el servidor. Verifica tu conexión.';
    } else if (error.status === 500) {
      return 'El servidor encontró un error. Por favor, intenta más tarde.';
    }
    
    return 'Hubo un error al comunicarme con el servidor. Por favor, intenta de nuevo más tarde.';
  }
}

 
}
