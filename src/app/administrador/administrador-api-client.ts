import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class AdministradorApiClient {
    private readonly httpClient: HttpClient = inject(HttpClient);

    // Listar absolutamente todos los turnos del sistema
    listarTodosLosTurnos(): Observable<any[]> {
        return this.httpClient.get<any[]>('/api/v1/admin/turnos');
    }

    // Modificar el valor/precio de la consulta médica
    actualizarValorConsulta(nuevoValor: number): Observable<void> {
        return this.httpClient.put<void>('/api/v1/admin/configuracion/valor-consulta', { valor: nuevoValor });
    }
}