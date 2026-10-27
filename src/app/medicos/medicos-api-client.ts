import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class MedicosApiClient {
    private readonly httpClient: HttpClient = inject(HttpClient);

    // Listar los turnos asignados al médico logueado (opcionalmente filtrados por fecha)
    listarTurnosMedico(fecha?: string): Observable<any[]> {
        const url = fecha ? `/api/v1/medicos/turnos?fecha=${fecha}` : '/api/v1/medicos/turnos';
        return this.httpClient.get<any[]>(url);
    }

    // Actualizar el estado del turno (ej: ATENDIDO, AUSENTE)
    actualizarEstadoTurno(idTurno: number, estado: string): Observable<void> {
        return this.httpClient.patch<void>(`/api/v1/medicos/${idTurno}/estado`, { estado });
    }
}