import { Component } from '@angular/core';
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
  // Asegúrate de que todos los módulos necesarios estén en los imports
  imports: [
    MatCardModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    CommonModule
    // No es necesario importar HomeComponent aquí si no se usa directamente en el template
  ],
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent {
  // Arreglo para almacenar la conversación.
  mensajes: { text: string; sender: 'user' | 'ai' }[] = [];
  // Variable para el input del usuario.
  mensajeActual: string = '';
  // Indicador de carga para mostrar cuando la IA está respondiendo.
  isLoading: boolean = false;

  constructor(private router: Router) {
    // Mensaje de bienvenida inicial del chatbot.
    this.mensajes.push({
      text: '¡Hola! Soy el asistente de Heladería Delicioso. ¿En qué puedo ayudarte hoy? Puedes preguntarme por nuestro horario, dirección o teléfono.',
      sender: 'ai'
    });
  }

  cerrarChat() {
    this.router.navigate(['/home']);
  }

  /**
   * Envía el mensaje del usuario y espera la respuesta de la IA.
   */
  async enviarMensaje() {
    if (!this.mensajeActual.trim() || this.isLoading) {
      return;
    }

    const nuevoMensajeUsuario = { text: this.mensajeActual, sender: 'user' as const };
    this.mensajes.push(nuevoMensajeUsuario);
    this.mensajeActual = '';
    this.isLoading = true;

    try {
      const respuestaIA = await this.llamarGeminiApi(nuevoMensajeUsuario.text);
      const nuevoMensajeIA = { text: respuestaIA, sender: 'ai' as const };
      this.mensajes.push(nuevoMensajeIA);
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
      this.mensajes.push({ text: "Disculpa, hubo un error. Intenta de nuevo más tarde.", sender: 'ai' });
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Realiza la llamada a la API de Gemini con el prompt adecuado.
   * @param userPrompt La pregunta del usuario.
   * @returns La respuesta de la IA.
   */
  private async llamarGeminiApi(userPrompt: string): Promise<string> {
    // El "prompt" es la clave. Aquí le das a la IA la información específica para que responda.
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
      
      if (result.candidates && result.candidates.length > 0 && 
          result.candidates[0].content && result.candidates[0].content.parts && 
          result.candidates[0].content.parts.length > 0) {
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