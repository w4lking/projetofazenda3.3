import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ViewWillEnter } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit, ViewWillEnter {
  isAdmin: boolean = false;
  isProprietario: boolean = false;
  isFuncionario: boolean = false;

  constructor(private readonly router: Router) { }

  ngOnInit() {
    this.verificarSessao();
  }

  ionViewWillEnter() {
    this.verificarSessao();
  }

  private verificarSessao(): void {
    const perfilUsuario = sessionStorage.getItem('perfil');
    const sessionId = sessionStorage.getItem('sessionId');

    this.isAdmin = perfilUsuario === 'ADMINISTRADOR';
    this.isProprietario = perfilUsuario === 'PROPRIETARIO';
    this.isFuncionario = perfilUsuario === 'FUNCIONARIO';

    if (!sessionId) {
      console.log('Sessão inválida. Redirecionando para login...');
      this.router.navigate(['/login']);
    }
  }
}
