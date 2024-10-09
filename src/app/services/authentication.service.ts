import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private router: Router) { }

  // Verifica se o usuário está autenticado
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return token != null;
  }

  // Obtém o token armazenado no localStorage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Desloga o usuário e remove o token
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('perfil');
    localStorage.removeItem('sessionId');
    this.router.navigate(['login']);  // Redireciona para a página de login
  }

  // Função para verificar se o token expirou (com base no backend)
  tokenExpired(token: string): boolean {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);  // Hora atual em segundos
    return payload.exp < currentTime;  // Verifica se o token expirou
  }
}
