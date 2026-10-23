import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PacientesApiClient } from '../pacientes-api-client';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'app-crear-turno',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule],
    templateUrl: './crear-turno.component.html',
    styleUrl: './crear-turno.component.css'
})
export class CrearTurnoComponent {
    private readonly pacientesApi = inject(PacientesApiClient);
    private readonly messageService = inject(MessageService);

    // Evento para avisarle al componente principal que el turno se creó y recargar la tabla
    @Output() turnoCreado = new EventEmitter<void>();

    form: FormGroup = new FormGroup({
        idMedico: new FormControl(null, [Validators.required]),
        fechaHora: new FormControl(null, [Validators.required])
    });

    guardarTurno() {
        if (this.form.invalid) {
            this.messageService.add({
                severity: 'error',
                summary: 'Formulario inválido',
                detail: 'Por favor, complete todos los campos requeridos'
            });
            return;
        }

        const dto = this.form.value;

        this.pacientesApi.crearTurno(dto).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: '¡Éxito!',
                    detail: 'El turno ha sido reservado correctamente'
                });
                this.turnoCreado.emit(); // Emitimos el evento
                this.form.reset();
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error al reservar',
                    detail: err.error?.message || 'No se pudo completar la reserva'
                });
            }
        });
    }
}