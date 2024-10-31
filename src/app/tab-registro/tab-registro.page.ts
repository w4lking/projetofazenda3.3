import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';
import { ViewWillEnter } from '@ionic/angular';

@Component({
  selector: 'app-tab-registro',
  templateUrl: './tab-registro.page.html',
  styleUrls: ['./tab-registro.page.scss'],
})
export class TabRegistroPage implements OnInit {

  funcionarios: any[] = [];
  constructor() { }

  ngOnInit() {
    
  }

}
