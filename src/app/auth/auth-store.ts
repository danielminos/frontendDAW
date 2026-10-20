import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class AuthStore {

    private readonly router: Router = inject(Router);

    guardarToken(token: string): void {
        sessionStorage.setItem('accessToken', token);
    }

    obtenerToken(): string | null {
        return sessionStorage.getItem('accessToken');
    }
    cerrarSesion(): void {
        sessionStorage.removeItem('accessToken');
        this.router.navigateByUrl('/login');
    }

    // Método para decodificar el payload del JWT y leer los datos (incluyendo el rol)
    obtenerUsuarioDelToken(): any {
        const token = this.obtenerToken();
        if (!token) return null;

        try {
            // El JWT tiene 3 partes separadas por puntos, la del medio es el payload
            const payloadBase64 = token.split('.')[1];
            // Decodificamos de Base64 a JSON string y luego a objeto
            const payloadDecodificado = atob(payloadBase64);
            return JSON.parse(payloadDecodificado);
        } catch (error) {
            console.error('Error al decodificar el token', error);
            return null;
        }
    }

}