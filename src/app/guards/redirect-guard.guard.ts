import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ApiService } from '../services/api.service'; // Importe seu serviço de API
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RedirectGuardGuard implements CanActivate {

  constructor(private apiService: ApiService, private router: Router) {}

  canActivate(): Observable<boolean> {
    // Obtenha o email do usuário armazenado localmente
    const email = this.apiService.getUsuario(); // Pega o email do usuário
    
    if (!email) {
      // Se não tiver email, redirecione ou negue o acesso
      this.router.navigate(['/login']); // ou qualquer rota de fallback
      return new Observable((observer) => observer.next(false));
    }

    // Obtém o perfil do usuário através do serviço de autenticação
    return this.apiService.getTipoDeUsuario(email).pipe(
      map((res: any) => {
        if (res.perfil === 'ADMINISTRADOR') {
          this.router.navigate(['/tabs/tab1']); // Redireciona para tab1
          return false; // Bloqueia o acesso atual e redireciona
        } else if (res.perfil === 'PROPRIETARIO') {
          this.router.navigate(['/tabs/tab3']); // Redireciona para tab3
          return false; // Bloqueia o acesso atual e redireciona
        } else {
          return true; // Permite a navegação para outros perfis
        }
      })
    );
  }
}
