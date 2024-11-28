import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  sessionId = sessionStorage.getItem('sessionId');

  constructor(private readonly router: Router) { }

  canActivate(): boolean {
    if (!this.sessionId) {
      console.log('Sessão inválida. Redirecionando para login...');
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
