import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ApiService } from '../services/api.service'; // Importe seu serviço de API
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RedirectGuardGuard implements CanActivate {

  constructor(private apiService: ApiService, private router: Router) {}

  canActivate(): Observable<boolean> {
    const email = this.apiService.getUsuario();
    if (!email) {
      this.router.navigate(['/login']);
      return new Observable((observer) => observer.next(false));
    }
    const perfil = sessionStorage.getItem('perfil');
    if (!perfil) {
      return new Observable((observer) => observer.next(false));
    }
    return from([perfil]).pipe(
      map((res: any) => {
        if (res.perfil === 'ADMINISTRADOR') {
          this.router.navigate(['/tabs/tab1']);
          return false;
        } else if (res.perfil === 'PROPRIETARIO') {
          this.router.navigate(['/tabs/tab3']);
          return false;
        } else {
          return true;
        }
      })
    );
  }
}
