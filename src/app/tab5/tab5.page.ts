import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, MenuController, ToastController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
})
export class Tab5Page implements OnInit {

  constructor(
    private router: Router,
    private provider: ApiService,
    public toastController: ToastController,
    public loadingController: LoadingController,
    private menu: MenuController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
  }


  fecharMenu() {
    this.menu.close();
  }

  goProfile() {
    this.router.navigate(['/profile']);
  }

  sair() {
    this.router.navigate(['/login']);
    sessionStorage.clear();
    console.log('Sessão encerrada Funcionário');
  }

}
