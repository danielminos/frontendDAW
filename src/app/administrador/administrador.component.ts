import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdministradorApiClient } from './administrador-api-client';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthStore } from "../auth/auth-store";
import { MedicoItem } from "../pacientes/pacientes-api-client";

interface DtoCrearTurnoAdmin {
    fecha: string;
    hora: string;
    idMedico: number;
    idPaciente: number;
}

@Component({
    selector: 'app-administrador',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, InputNumberModule, FormsModule],
    templateUrl: './administrador.component.html',
    styleUrl: './administrador.component.css'
})
export class AdministradorComponent implements OnInit {
    private readonly adminApi = inject(AdministradorApiClient);
    private readonly router = inject(Router);
    private readonly messageService = inject(MessageService);
    private readonly authStore = inject(AuthStore);

    turnos = signal<any[]>([]);
    medicos = signal<MedicoItem[]>([]);
    nuevoValorConsulta: number = 0;

    ngOnInit() {
        this.cargarTurnosGlobales();
        this.cargarMedicos();
    }

    cargarTurnosGlobales() {
        this.adminApi.listarTodosLosTurnos().subscribe({
            next: (data) => {
                this.turnos.set(data);
            },
            error: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudieron cargar los turnos del sistema'
                });
            }
        });
    }

    cargarMedicos() {
        this.adminApi.listarMedicos().subscribe({
            next: (data) => {
                this.medicos.set(data);
            },
            error: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo cargar la lista de médicos'
                });
            }
        });
    }

    cancelarTurno(idTurno: number) {
        this.adminApi.cancelarTurnoAdmin(idTurno).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Turno cancelado',
                    detail: 'El turno fue cancelado con éxito'
                });
                this.cargarTurnosGlobales(); //recarga la lista
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error al cancelar el turno',
                    detail: err.error?.message || 'No se pudo cancelar el turno'
                });
            }
        });
    }

    idMedicoSeleccionado: number | null = null;
    guardarValorConsulta() {
        if (this.idMedicoSeleccionado === null) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Falta seleccionar un médico',
                detail: 'Elegí un médico antes de actualizar el valor'
            });
            return;
        }

        this.adminApi.actualizarValorConsultaMedico(this.idMedicoSeleccionado, this.nuevoValorConsulta).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Actualizado',
                    detail: 'El valor de la consulta fue modificado con éxito'
                });
                this.cargarMedicos();
            },
            error: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo actualizar el valor de la consulta'
                });
            }
        });
    }

    cerrarSesion() {
        this.authStore.cerrarSesion();
    }
}