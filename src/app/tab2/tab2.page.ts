import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ToastController, LoadingController, AlertController } from '@ionic/angular'; // Adicione AlertController

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit  {
  usuarios: any[] = [];

  constructor(
    private provider: ApiService,
    public toastController: ToastController,
    public loadingController: LoadingController,
    public alertController: AlertController 
  ) {}

  ngOnInit() {
    this.obterUsuarios();
  }

  async obterUsuarios() {
    const loading = await this.loadingController.create({
      message: 'Carregando usuários...',
    });
    await loading.present();

    this.provider.obterTodosUsuarios().subscribe(
      async (data: any) => {
        if (data.ok) {
          this.usuarios = data.usuarios; // Atribui os usuários à variável
        } else {
          this.mensagem('Nenhum usuário encontrado', 'danger');
        }
        await loading.dismiss();
      },
      async (error) => {
        await loading.dismiss();
        this.mensagem('Erro ao carregar usuários', 'danger');
      }
    );
  }

  editarUsuario(usuario: any) {
    console.log('Editar usuário:', usuario);
    // Lógica para editar o usuário
  }

  alterarBloqueio(usuario: any) {
    if (usuario.idusuarios === 1) { // Verifica se o usuário é o administrador
      this.mensagem('O administrador não pode ser bloqueado!', 'danger');
      return;
    }
    usuario.bloqueado = usuario.bloqueado == 1 ? 0 : 1; // Alterna o bloqueio
  
    // Envia a requisição para o backend para alterar o status no banco de dados
    this.provider.alterarBloqueio(usuario.email, usuario.bloqueado).subscribe(
      (res: any) => {
        if (res.ok) {
          console.log('Status de bloqueio alterado com sucesso no banco de dados:', usuario);
          this.mensagem('Bloqueio atualizado com sucesso!', 'success');
        } else {
          console.log('Falha ao alterar o status de bloqueio no banco de dados:', res.mensagem);
          this.mensagem('Erro ao atualizar o bloqueio. Tente novamente!', 'danger');
        }
      },
      (error) => {
        console.error('Erro na requisição:', error);
        this.mensagem('Erro ao conectar-se ao servidor. Tente novamente!', 'danger');
      }
    );
  }

  // Função de confirmação para excluir o usuário
  async confirmarExclusaoUsuario(usuario: any) {
    if (usuario.idusuarios === 1) { // Verifica se o usuário é o administrador
      this.mensagem('O administrador não pode ser excluído!', 'danger');
      return;
    }
  
    const alert = await this.alertController.create({
      header: 'Confirmação de exclusão',
      message: 'Tem certeza que deseja excluir este usuário?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Exclusão cancelada');
          }
        },
        {
          text: 'Excluir',
          handler: () => {
            this.excluirUsuario(usuario.idusuarios); // Chama a função de exclusão se o usuário confirmar
          }
        }
      ]
    });
  
    await alert.present();
  }
  

  // Função de exclusão
  excluirUsuario(id: any) {
    console.log('Excluir usuário:', id); // Aqui você deve ver o ID sendo exibido no console
    this.provider.deletarUsuario(id).subscribe(
      (res: any) => {
        if (res.ok) {
          console.log('Usuário excluído com sucesso:', id);
          this.mensagem('Usuário excluído com sucesso!', 'success');
          this.obterUsuarios(); // Atualiza a lista de usuários
        } else {
          console.log('Falha ao excluir o usuário:', res.mensagem);
          this.mensagem('Erro ao excluir o usuário. Tente novamente!', 'danger');
        }
      },
      (error) => {
        console.error('Erro na requisição:', error);
        this.mensagem('Erro ao conectar-se ao servidor. Tente novamente!', 'danger');
      }
    );
  }

  async mensagem(mensagem: any, cor: string) {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 2000,
      color: cor
    });
    toast.present();
  }
}