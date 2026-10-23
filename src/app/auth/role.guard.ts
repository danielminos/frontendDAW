import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthStore } from './auth-store'; // Ajusta la ruta a tu AuthStore

export const roleGuard: CanActivateFn = (route, state) => {
    const authStore = inject(AuthStore);
    const router = inject(Router);

    // Obtenemos los roles permitidos que definimos en la ruta (data: { expectedRole: '...' })
    const expectedRole = route.data?.['expectedRole'];

    // Obtenemos el usuario decodificado del token
    const usuario = authStore.obtenerUsuarioDelToken();

    // Si no hay usuario o no tiene el rol esperado, lo redirigimos al login
    if (!usuario || (expectedRole && usuario.rol !== expectedRole)) {
        router.navigate(['/login']);
        return false;
    }

    return true;
};