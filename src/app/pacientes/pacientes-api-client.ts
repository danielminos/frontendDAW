import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface MedicoItem {
    idMedico: number;
    apellido: string;
    nombre: string;
    matricula: number;
    valorConsulta: number;
}

@Injectable({
    providedIn: 'root'
})
export class PacientesApiClient {
    private readonly httpClient: HttpClient = inject(HttpClient);

    // Listar los turnos del paciente logueado
    listarTurnos(): Observable<any[]> {
        return this.httpClient.get<any[]>('/api/v1/pacientes/turnos');
    }

    // listar los medicos para elegir en el formulario
    listarMedicos(): Observable<MedicoItem[]> {
        return this.httpClient.get<MedicoItem[]>('/api/v1/medicos');
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