import { Component, ViewChild, ElementRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../../environments/environment';

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

  constructor(private router: Router) {
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
      // The call is now made to your own backend
      const respuestaIA = await this.llamarGeminiApi(nuevoMensajeUsuario.text);
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

  // This method now calls your backend instead of the Gemini API directly
  private async llamarGeminiApi(userPrompt: string): Promise<string> {
    try {
      // Send the user's prompt to your custom backend endpoint
      const response = await fetch(`${environment.apiUrl}/api/gemini`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userPrompt })
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const result = await response.json();
      
      // Get the response text from the backend's JSON
      return result.respuestaIA;

    } catch (error) {
      console.error('Error in the call to your backend API:', error);
      return "Hubo un error al comunicarme con el servidor. Por favor, intenta de nuevo más tarde.";
    }
  }
}