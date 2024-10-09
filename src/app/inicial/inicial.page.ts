// Código TypeScript
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inicial',
  templateUrl: './inicial.page.html',
  styleUrls: ['./inicial.page.scss'],
})
export class InicialPage implements OnInit {

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
  }

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
