import { Component, inject } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MessageService } from "primeng/api";
import { LoginApiClient } from "./login-api-client";
import { AuthStore } from "../auth-store";
import { Router } from "@angular/router";
import { Button } from "primeng/button";
import { InputText } from "primeng/inputtext";
import { Password } from 'primeng/password';


@Component({
    selector: 'app-login',
    templateUrl: './login.html',
    styleUrl: './login.css',
    imports: [ReactiveFormsModule, InputText, Button, Password]
})
export class Login {

    private readonly messageService: MessageService = inject(MessageService)

    private readonly loginApiClient: LoginApiClient = inject(LoginApiClient)

    private readonly authStore: AuthStore = inject(AuthStore)

    private readonly router: Router = inject(Router)

    form: FormGroup = new FormGroup({
        email: new FormControl(null, Validators.required),
        clave: new FormControl(null, Validators.required)
    });

    iniciarSesion() {
        if (!this.form.valid) {
            this.messageService.add({
                severity: 'error',
                summary: 'Ha ocurrido un error al iniciar sesion',
                detail: 'Complete todos los campos'
            })
            return
        }

        const email: string = this.form.value.email;
        const clave: string = this.form.value.clave;

        this.loginApiClient.iniciarSesion(email, clave).subscribe({
            next: (res) => {
                this.authStore.guardarToken(res.accessToken);

                const usuarioData = this.authStore.obtenerUsuarioDelToken();
                const rol = usuarioData?.rol;

                this.messageService.add({
                    severity: 'success',
                    summary: 'Iniciaste sesion correctamente',
                    detail: 'Ahora puedes navegar por la aplicacion'
                })

                // Redirección dinámica según el rol
                if (rol === 'ADMINISTRADOR') {
                    this.router.navigate(['/administrador/turnos']);
                } else if (rol === 'MEDICO') {
                    this.router.navigate(['/medicos/turnos']);
                } else if (rol === 'PACIENTE') {
                    this.router.navigate(['/pacientes/turnos']);
                } else {
                    // Cerrar sesión como prevención
                    this.authStore.cerrarSesion();
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Ha ocurrido un error al iniciar sesion',
                        detail: 'Rol de usuario no reconocido'
                    })
                }
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Ha ocurrido un error al iniciar sesion',
                    detail: 'Revise sus credenciales'
                })
            }
        })
    }
}