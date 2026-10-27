import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
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
    private readonly messageService = inject(MessageService);

    turnos = signal<any[]>([]);
    fecha = signal<string>(this.hoy());

    ngOnInit() {
        this.cargarTurnos();
    }

    cargarTurnos() {
        this.medicosApi.listarTurnosMedico(this.fecha() || undefined).subscribe({
            next: (data) => {
                this.turnos.set(data);
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

    //se ejecuta cuando el medico elige otro dia en el calednario
    cambiarFecha(valor:string) {
        this.fecha.set(valor);
        this.cargarTurnos();
    }

    //quita el filtro y muestra todos los turnos sin importar fecha
    verTodos() {
        this.fecha.set('');
        this.cargarTurnos();
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

    private hoy(): string {
        return new Date().toLocaleDateString('en-CA');
    }

    //metodo para cerrar sesion
    cerrarSesion() {
        //borra el token de session storage y redirige al login
        this.authStore.cerrarSesion();
    }
}