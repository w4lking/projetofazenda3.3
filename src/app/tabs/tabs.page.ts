import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
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

  constructor(private api: ApiService, private router: Router) { }

  ngOnInit() {
    const perfilUsuario = sessionStorage.getItem('perfil');
    const sessionId = sessionStorage.getItem('sessionId');
    const email = sessionStorage.getItem('email');
    const id = sessionStorage.getItem('id');


    // Verifique se o perfil é ADMINISTRADOR ou PROPRIETARIO
    this.isAdmin = perfilUsuario === 'ADMINISTRADOR';
    this.isProprietario = perfilUsuario === 'PROPRIETARIO';
    this.isFuncionario = perfilUsuario === 'FUNCIONARIO';

    // Se o identificador de sessão não estiver presente, redirecione para o login
    if (!sessionId) {
      console.log('Sessão inválida. Redirecionando para login...');
      this.router.navigate(['/login']);
      return;
    }

  }


  ionViewWillEnter() {
    // Este método será chamado sempre que a página for exibida
    const perfilUsuario = sessionStorage.getItem('perfil');
    const sessionId = sessionStorage.getItem('sessionId');
    const id = sessionStorage.getItem('id');

    // Verifique se o perfil é ADMINISTRADOR ou PROPRIETARIO
    this.isAdmin = perfilUsuario === 'ADMINISTRADOR';
    this.isProprietario = perfilUsuario === 'PROPRIETARIO';
    this.isFuncionario = perfilUsuario === 'FUNCIONARIO';

    // Se o identificador de sessão não estiver presente, redirecione para o login
    if (!sessionId) {
      console.log('Sessão inválida. Redirecionando para login...');
      this.router.navigate(['/login']);
      return;
    }

  }

}
