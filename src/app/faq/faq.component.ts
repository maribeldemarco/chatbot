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



  private async llamarGeminiApi(userPrompt: string): Promise<string> {
    const prompt = `Eres un chatbot útil para una popular heladería llamada "Ice Cream Shop". Tu propósito es responder preguntas frecuentes.

    Aquí están los datos específicos que debes usar, no inventes nada:
    - Dirección: Calle Falsa 123, Buenos Aires.
    - Teléfono: 11-1111-8910.
    - Horario: Lunes a viernes de 10:00 a 22:00, sábados y domingos de 11:00 a 23:00.
    - Productos: Vendemos helados a domicilio.

    Basado en esta información, responde a la pregunta del usuario: "${userPrompt}"`;

    const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
    const payload = { contents: chatHistory };
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${environment.geminiApiKey}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
        return result.candidates[0].content.parts[0].text;
      } else {
        return "Lo siento, no pude generar una respuesta. Por favor, intenta de nuevo.";
      }
    } catch (error) {
      console.error('Error en la llamada a la API de Gemini:', error);
      return "Hubo un error al comunicarme con el servidor. Por favor, intenta de nuevo más tarde.";
    }
  }
}
