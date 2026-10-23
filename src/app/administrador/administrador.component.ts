import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdministradorApiClient } from './administrador-api-client';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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

    turnos: any[] = [];
    nuevoValorConsulta: number = 0;

    ngOnInit() {
        this.cargarTurnosGlobales();
    }

    cargarTurnosGlobales() {
        this.adminApi.listarTodosLosTurnos().subscribe({
            next: (data) => {
                this.turnos = data;
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

    idMedicoSeleccionado: number = 1;
    guardarValorConsulta() {
        this.adminApi.actualizarValorConsultaMedico(this.idMedicoSeleccionado, this.nuevoValorConsulta).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Actualizado',
                    detail: 'El valor de la consulta fue modificado con éxito'
                });
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
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
    }
}