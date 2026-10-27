import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PacientesApiClient } from './pacientes-api-client';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CrearTurnoComponent } from './crear-turno/crear-turno.component';
import { AuthStore } from "../auth/auth-store";

@Component({
    selector: 'app-pacientes',
    standalone: true,
    imports: [CommonModule, ButtonModule, TableModule, CrearTurnoComponent],
    templateUrl: './pacientes.component.html',
    styleUrl: './pacientes.component.css'
})
export class PacientesComponent implements OnInit {
    private readonly pacientesApi = inject(PacientesApiClient);
    private readonly authStore = inject(AuthStore);
    private readonly messageService = inject(MessageService);

    turnos = signal<any[]>([]);

    ngOnInit() {
        this.cargarTurnos();
    }

    cargarTurnos() {
        this.pacientesApi.listarTurnos().subscribe({
            next: (data) => {
                this.turnos.set(data);
            },
            error: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudieron cargar tus turnos'
                });
            }
        });
    }

    cancelarTurno(idTurno: number) {
        this.pacientesApi.cancelarTurno(idTurno).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Turno cancelado',
                    detail: 'El turno fue cancelado correctamente'
                });
                this.cargarTurnos(); // Recargamos la lista
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error al cancelar',
                    detail: err.error?.message || 'No se pudo cancelar el turno'
                });
            }
        });
    }

    cerrarSesion() {
        // borra el token de session storage y redirige al login
        this.authStore.cerrarSesion();
    }
}