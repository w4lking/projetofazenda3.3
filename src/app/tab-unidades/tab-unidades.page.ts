import { Component} from '@angular/core';
import { ModalController, ToastController, LoadingController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab-unidades',
  templateUrl: './tab-unidades.page.html',
  styleUrls: ['./tab-unidades.page.scss'],
})
export class TabUnidadesPage {

  nome: string = '';
  unidade: string = '';

  constructor(
    private readonly provider: ApiService,
    private readonly toastController: ToastController,
    private readonly modalCtrl: ModalController,
    private readonly router: Router,
    private readonly loadingController: LoadingController,
  ) { }

  cancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  back() {
    this.router.navigate(['/tabs/tab1']);
  }

  async confirmEquipamentos() {
    if (!this.nome) {
      this.presentAlert('Erro', 'Nome do equipamento é obrigatório');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Adicionando equipamento...',
    });
    await loading.present();

    this.provider.addEquipamento(this.nome).then(
      async (res: any) => {
        await loading.dismiss();
        if (res.status === 'success' || res.ok) {
          this.presentAlert('Sucesso', 'Equipamento adicionado com sucesso');
          this.cancel();
          this.nome = '';
        } else {
          this.presentAlert('Erro', 'Erro ao adicionar equipamento. Tente novamente!');
        }
      }
    ).catch(async (error) => {
      await loading.dismiss();
      console.error('Erro ao adicionar equipamento:', error);
      this.presentAlert('Erro', 'Erro ao conectar-se ao servidor. Tente novamente!');
    });
  }

  async confirmInsumos() {
    if (!this.nome || !this.unidade) {
      this.presentAlert('Erro', 'Nome e unidade são obrigatórios');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Adicionando insumo...',
    });
    await loading.present();

    this.provider.addInsumo(this.nome, this.unidade).then(
      async (res: any) => {
        await loading.dismiss();
        if (res.status === 'success' || res.ok) {
          this.presentAlert('Sucesso', 'Insumo adicionado com sucesso');
          this.cancel();
          this.nome = '';
          this.unidade = '';
        } else {
          this.presentAlert('Erro', 'Erro ao adicionar insumo. Tente novamente!');
        }
      }
    ).catch(async (error) => {
      await loading.dismiss();
      console.error('Erro ao adicionar insumo:', error);
      this.presentAlert('Erro', 'Erro ao conectar-se ao servidor. Tente novamente!');
    });
  }


  async presentAlert(header: string, message: string) {
    const alert = await this.toastController.create({
      header,
      message,
      buttons: ['OK'],
    });

    await alert.present();
  }


}
