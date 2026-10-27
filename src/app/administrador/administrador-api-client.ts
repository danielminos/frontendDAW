import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MedicoItem } from "../pacientes/pacientes-api-client";

@Injectable({
    providedIn: 'root'
})
export class AdministradorApiClient {
    private readonly httpClient: HttpClient = inject(HttpClient);

    // 1) POST /api/v1/administrador/turnos - Crear un turno como admin
    crearTurnoAdmin(dto: any): Observable<any> {
        return this.httpClient.post<any>('/api/v1/administrador/turnos', dto);
    }

    // 2) GET /api/v1/administrador/turnos - Listar todos los turnos
    listarTodosLosTurnos(): Observable<any[]> {
        return this.httpClient.get<any[]>('/api/v1/administrador/turnos');
    }

    // 3) PUT /api/v1/administrador/{id}/cancelar - Cancelar un turno por ID
    cancelarTurnoAdmin(idTurno: number): Observable<void> {
        return this.httpClient.put<void>(`/api/v1/administrador/${idTurno}/cancelar`, {});
    }

    // 4) PUT /api/v1/administrador/medicos/{idMedico}/valor - Actualizar valor de consulta del médico
    actualizarValorConsultaMedico(idMedico: number, nuevoValor: number): Observable<void> {
        return this.httpClient.put<void>(`/api/v1/administrador/medicos/${idMedico}/valor`, { valorConsulta: nuevoValor });
    }

    // 5) GET /api/v1/medicos - Listar medicos para elegir
    listarMedicos(): Observable<MedicoItem[]> {
        return this.httpClient.get<MedicoItem[]>('/api/v1/medicos');
    }
}