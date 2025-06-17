import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  private apiUrl = 'http://localhost:3000/'; // 
private baseUrl = 'http://localhost:3000/dialogflow';

  constructor(private http: HttpClient) {
  }

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