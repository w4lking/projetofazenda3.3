import { Router } from '@angular/router';
import { Component} from '@angular/core';

@Component({
  selector: 'app-inicial',
  templateUrl: './inicial.page.html',
  styleUrls: ['./inicial.page.scss'],
})
export class InicialPage{

  constructor(
    private readonly router: Router,
  ) { }

  isModalOpen = false;

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }


  login(){
    this.router.navigate(['/login']);
  }

  cadastro(){
    this.router.navigate(['/sign-up']);
  }


}
