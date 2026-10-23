import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { roleGuard } from './auth/role.guard';

export const routes: Routes = [
    { path: 'login', component: Login },

    // Ruta protegida para Administradores
    {
        path: 'administrador/turnos',
        loadComponent: () => import('./administrador/administrador.component').then(m => m.AdministradorComponent),
        canActivate: [roleGuard],
        data: { expectedRole: 'ADMINISTRADOR' }
    },

    // Ruta protegida para Médicos
    {
        path: 'medicos/turnos',
        loadComponent: () => import('./medicos/medicos.component').then(m => m.MedicosComponent),
        canActivate: [roleGuard],
        data: { expectedRole: 'MEDICO' }
    },

    // Ruta protegida para Pacientes
    {
        path: 'pacientes/turnos',
        loadComponent: () => import('./pacientes/pacientes.component').then(m => m.PacientesComponent),
        canActivate: [roleGuard],
        data: { expectedRole: 'PACIENTE' }
    },

    // Ruta por defecto o comodín
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'login' }
];