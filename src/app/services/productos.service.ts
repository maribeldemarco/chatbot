import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  private apiUrl = 'http://localhost:3000/'; // 

  constructor(private http: HttpClient) {
  }

  getProductos(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

getSabores(): Observable<any[]> { 
    return this.http.get<any[]>(`${this.apiUrl}api/sabores`); 

}
}