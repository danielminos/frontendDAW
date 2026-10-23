import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PacientesApiClient } from './pacientes-api-client';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CrearTurnoComponent } from './crear-turno/crear-turno.component';
import { Router } from '@angular/router';

@Component({
    selector: 'app-pacientes',
    standalone: true,
    imports: [CommonModule, ButtonModule, TableModule, CrearTurnoComponent],
    templateUrl: './pacientes.component.html',
    styleUrl: './pacientes.component.css'
})
export class PacientesComponent implements OnInit {
    private readonly pacientesApi = inject(PacientesApiClient);
    private readonly router = inject(Router);
    private readonly messageService = inject(MessageService);

    turnos: any[] = [];

    ngOnInit() {
        this.cargarTurnos();
    }

    cargarTurnos() {
        this.pacientesApi.listarTurnos().subscribe({
            next: (data) => {
                this.turnos = data;
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
        localStorage.removeItem('token'); // O limpia el almacenamiento que utilices
        this.router.navigate(['/login']);
    }
}