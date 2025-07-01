import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  private apiUrl = environment.apiUrl;
private baseUrl = this.apiUrl + 'dialogflow'; // https://chatbot-wb8b.onrender.com/dialogflow

  constructor(private http: HttpClient) { }

  getProductos(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getSabores(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}api/sabores`);
  }

  sendMessage(message: string) {
    return this.http.post<{ reply: string }>(this.baseUrl, { message });
  }
}
