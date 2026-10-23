import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class PacientesApiClient {
    private readonly httpClient: HttpClient = inject(HttpClient);

    // Listar los turnos del paciente logueado
    listarTurnos(): Observable<any[]> {
        return this.httpClient.get<any[]>('/api/v1/pacientes/turnos');
    }

    // Crear un nuevo turno
    crearTurno(dto: { idMedico: number; fechaHora: string }): Observable<{ id: number }> {
        return this.httpClient.post<{ id: number }>('/api/v1/pacientes/turnos', dto);
    }

    // Cancelar un turno
    cancelarTurno(idTurno: number): Observable<void> {
        return this.httpClient.put<void>(`/api/v1/pacientes/${idTurno}/cancelar`, {});
    }
}