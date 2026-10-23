import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MedicosApiClient } from './medicos-api-client';
import { AuthStore } from '../auth/auth-store'; // Ajusta la ruta a tu AuthStore
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

@Component({
    selector: 'app-medicos',
    standalone: true,
    imports: [CommonModule, ButtonModule, TableModule],
    templateUrl: './medicos.component.html',
    styleUrl: './medicos.component.css'
})
export class MedicosComponent implements OnInit {
    private readonly medicosApi = inject(MedicosApiClient);
    private readonly authStore = inject(AuthStore);
    private readonly router = inject(Router);
    private readonly messageService = inject(MessageService);

    turnos: any[] = [];

    ngOnInit() {
        this.cargarTurnos();
    }

    cargarTurnos() {
        this.medicosApi.listarTurnosMedico().subscribe({
            next: (data) => {
                this.turnos = data;
            },
            error: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudieron cargar los turnos del médico'
                });
            }
        });
    }

    cambiarEstado(idTurno: number, nuevoEstado: string) {
        this.medicosApi.actualizarEstadoTurno(idTurno, nuevoEstado).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Estado actualizado',
                    detail: `El turno pasó a estar ${nuevoEstado.toLowerCase()}`
                });
                this.cargarTurnos();
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: err.error?.message || 'No se pudo actualizar el estado'
                });
            }
        });
    }

    // Método para cerrar sesión
    cerrarSesion() {
        // Si tu AuthStore tiene un método para limpiar el token (ej: logout o limpiarSesion), úsalo aquí.
        // O si guardas el token en localStorage:
        localStorage.removeItem('token'); // O el nombre que uses

        this.router.navigate(['/login']);
    }
}