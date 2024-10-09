import { telefoneMask } from './../masks';
import { map } from 'rxjs/operators';
import {HttpClient, HttpHeaders, HttpSentEvent} from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

//   server: string = 'http://apisfazenda2-b103529777b5.herokuapp.com/';
  server : string = 'https://apisfazenda2-b103529777b5.herokuapp.com/'; // Adicione esta linha 

    constructor(private http : HttpClient){
       
    }


     dadosApi(dados: any, api: string){
            const httpOptions = {
                headers: new HttpHeaders({'Content-Type' : 'application/json'})
                }

            let url = this.server + api;
            return this.http.post(url, JSON.stringify(dados), httpOptions).pipe(map(res => res));
        }

    getTipoDeUsuario(email: any){
        return this.http.get(this.server + 'gets/getPerfil.php?email=' + email).pipe(map((res: any) => res));
    }

    obterUsuariosDesautenticados() {
        return this.http.get(this.server + 'gets/getUsuariosNaoAutenticados.php').pipe(map((res: any) => res));
    }

    obterBloqueado(email: string){
        return this.http.get(this.server + 'gets/getBloqueado.php?email=' + email).pipe(map((res: any) => res));
    }

    obterAutenticado(email: string){
        return this.http.get(this.server + 'gets/getAutenticado.php?email=' + email).pipe(map((res: any) => res));
    }

    obterTodosUsuarios() {
        return this.http.get(this.server + 'gets/getUsuarios.php').pipe(map((res: any) => res));
    }

    obterUsuario(id: number) {
        return this.http.get(this.server + 'gets/getUsuario.php?id=' + id).pipe(map((res: any) => res));
    }

    obterUsuarioWithEmail(email: any) {
        return this.http.get(this.server + 'gets/getUsuarioWithEmail.php?email=' + email).pipe(map((res: any) => res));
    }

      

    alterarBloqueio(email: string, bloqueado: number) {
        return this.http.post(this.server + 'updates/updateBloqueio.php', {
          email: email,
          bloqueado: bloqueado
        }).pipe(map((res: any) => res));
      }

    altenticarUsuario(id: any){
        return this.http.post(this.server + 'updates/updateAutenticado.php', {
            id: id
        }).pipe(map((res: any) => res));
    }

    deletarUsuario(id: any){
        return this.http.post(this.server + 'deletes/deleteUsuario.php', {
            id: id
        }).pipe(map((res: any) => res));
    }
      
    armazernarUsuario(email: any){
        sessionStorage.setItem('email', email);
    }

    getIdUsuario(email: any) {
        return this.http.get(this.server + 'gets/getIdUsuario.php?email=' + email).pipe(
            map((res: any) => {
                if (res.ok) {
                    return res.id; // Retorna apenas o ID do usuário
                } else {
                    throw new Error(res.message); // Lança um erro se a resposta não for OK
                }
            })
        );
    }
    

    getUsuario(){
        return sessionStorage.getItem('email');
    }


    obterFazenda(id: any) {
        return this.http.get(this.server + 'gets/getFazenda.php?id=' + id).pipe(map((res: any) => res));
    }

    addFazenda(nome: any, cep: any, endereco: any ,valor: any, id: any){
        return this.http.post(this.server + 'inserts/insertFazenda.php', {
            nome: nome,
            cep: cep,
            endereco: endereco,
            valor: valor,
            id: id
        }).pipe(map((res: any) => res));
    }

    obterFuncionarios(id: any) {
        return this.http.get(this.server + 'gets/getFuncionarios.php?id=' + id).pipe(map((res: any) => res));
    }

    addFuncionarios(nome: any, cpf: any, email: any ,telefone: any, salario: any, senha: any, idFazenda: any,  idUsuario: any){
        return this.http.post(this.server + 'inserts/insertFuncionarios.php', {
            nome: nome,
            cpf: cpf,
            email: email,
            telefone: telefone,
            salario: salario,
            senha: senha,
            idFazenda: idFazenda,
            idUsuario: idUsuario
        }).pipe(map((res: any) => res));
    }

    editarFuncionarios(idfuncionario: any, nome: any, cpf: any, email: any,telefone: any, salario: any){
        return this.http.post(this.server + 'updates/updateFuncionario.php', {
            idfuncionario: idfuncionario,
            nome: nome,
            cpf: cpf,
            email: email,
            telefone: telefone,
            salario: salario,
        }).pipe(map((res: any) => res));
    }

    deletarFuncionarios(id: number){
        return this.http.get(this.server + 'deletes/deleteFuncionario.php?id=' + id).pipe(map((res: any) => res));
    }

    editarFazenda(nome: any, cep: any, endereco: any, valor: number, id: any){
        console.log('Dados enviados para a API:', {nome, cep, endereco, valor, id});  // Adicione este log
        return this.http.post(this.server + 'updates/updateFazenda.php', {
            nome: nome,
            cep: cep,
            endereco: endereco,
            valor: valor,
            id: id
        }).pipe(map((res: any) => res));
    }
    

    deletarFazenda(id: number){
        return this.http.get(this.server + 'deletes/deleteFazenda.php?id=' + id).pipe(map((res: any) => res));
    }

}
