import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  server: string = 'https://jsonserver-jet.vercel.app/api/'; // URL do servidor Node.js local

  // server: string = 'http://localhost:5000/api/'; // URL do servidor Node.js local para testes

  constructor(private http: HttpClient) { }

  async dadosApi(dados: any, api: string) {
    const options = {
      url: this.server + api,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(dados),
    };

    try {
      const response = await CapacitorHttp.request(options);
      return response.data;
    } catch (error) {
      console.error('Erro ao enviar dados para API', error);
      throw error;
    }
  }

  registrarUsuario(cpf: string, nome: string, email: string, senha: string, telefone: string, perfil: string): Observable<any> {
    const url = `${this.server}user/register`; // URL para a API de registro
    const body = { cpf, nome, email, senha, telefone, perfil }; // Dados enviados no corpo da requisição

    return this.http.post(url, body); // Realiza a requisição POST
  }

  async login(email: string, senha: string) {
    const options = {
      url: this.server + 'user/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({ email, senha }),
    };

    try {
      const response = await CapacitorHttp.request(options);
      return response.data;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw new Error('Erro na comunicação com o servidor.');
    }
  }

  async alterarSenha(id: any, senhaAtual: string, senha: string) {
    const options = {
      url: this.server + 'user/password',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: { id, senhaAtual, senha }, // Não precisa de `JSON.stringify` com CapacitorHttp
    };

    try {
      const response = await CapacitorHttp.request(options);
      return response.data;
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      throw new Error('Erro ao tentar alterar a senha.');
    }
  }

  async alterarSenhaFunc(id: any, senhaAtual: string, senha: string) {
    const options = {
      url: this.server + 'employer/password',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: { id, senhaAtual, senha }, // Não precisa de `JSON.stringify` com CapacitorHttp
    };

    try {
      const response = await CapacitorHttp.request(options);
      return response.data;
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      throw new Error('Erro ao tentar alterar a senha.');
    }
  }


  async getTipoDeUsuario(email: any) {
    const options = {
      url: this.server + 'user/type?email=' + email,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await CapacitorHttp.request(options);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter o tipo de usuário:', error);
      throw new Error('Erro ao tentar obter o tipo de usuário.');
    }
  }

  async getTipoDeFuncionario(email: any) {
    const options = {
      url: this.server + 'employees/type?email=' + email,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await CapacitorHttp.request(options);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter o tipo de usuário:', error);
      throw new Error('Erro ao tentar obter o tipo de usuário.');
    }
  }



  async obterUsuariosDesautenticados() {
    const options = {
      url: this.server + 'users/unauthenticated',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await CapacitorHttp.request(options);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter usuários desautenticados', error);
      throw error;
    }
  }

  async obterFuncionariosDesautenticados() {
    const options = {
      url: this.server + 'employees/unauthenticated',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await CapacitorHttp.request(options);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter funcionários desautenticados', error);
      throw error;
    }
  }

  async obterBloqueado(email: string) {
    const options = {
      url: this.server + 'user/blocked?email=' + email,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await CapacitorHttp.request(options);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter status de bloqueio', error);
      throw error;
    }
  }

  async obterAutenticado(email: string) {
    const options = {
      url: this.server + 'user/authenticated?email=' + email,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await CapacitorHttp.request(options);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter status de autenticação', error);
      throw error;
    }
  }

  async obterUsuarios() {
    const options = {
      url: this.server + 'users',  // URL correta para a rota
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await CapacitorHttp.request(options);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter usuários', error);
      throw error;
    }
  }

  async obterFunc() {
    const options = {
      url: this.server + 'employees/all',  // URL correta para a rota
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await CapacitorHttp.request(options);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter usuários', error);
      throw error;
    }
  }



  async obterUsuario(id: any) {
    const options = {
      url: this.server + 'user?id=' + id, // Ajuste o caminho para corresponder ao backend
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await CapacitorHttp.request(options);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter usuário', error);
      throw error;
    }
  }

  async obterFuncionario(id: any) {
    const options = {
      url: this.server + 'employer?id=' + id, // Ajuste o caminho para corresponder ao backend
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await CapacitorHttp.request(options);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter usuário', error);
      throw error;
    }
  }


  async obterUsuarioWithEmail(email: any) {
    const options = {
      url: this.server + 'user/email?email=' + email,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await CapacitorHttp.request(options);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter usuário pelo email', error);
      throw error;
    }
  }

  async obterFuncionarioWithEmail(email: any) {
    const options = {
      url: this.server + 'employees/email?email=' + email,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await CapacitorHttp.request(options);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter funcionario pelo email', error);
      throw error;
    }
  }

  async alterarBloqueio(id: any, bloqueado: number) {
    const options = {
      url: this.server + 'user/block',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({ id: id, bloqueado: bloqueado }),
    };

    try {
      const response = await CapacitorHttp.request(options);
      return response.data;
    } catch (error) {
      console.error('Erro ao alterar bloqueio', error);
      throw error;
    }
  }

  async alterarBloqueioFuncionario(id: any, bloqueado: number) {
    const options = {
      url: this.server + 'employees/block',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({ id: id, bloqueado: bloqueado }),
    };

    try {
      const response = await CapacitorHttp.request(options);
      return response.data;
    } catch (error) {
      console.error('Erro ao alterar bloqueio', error);
      throw error;
    }
  }

  async autenticarUsuario(id: any) {
    const options = {
      url: this.server + 'user/authenticate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({ id: id }),
    };

    try {
      const response = await CapacitorHttp.request(options);
      return response.data;
    } catch (error) {
      console.error('Erro ao autenticar usuário', error);
      throw error;
    }
  }

  async autenticarfuncionario(id: any) {
    const options = {
      url: this.server + 'employees/authenticate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({ id: id }),
    };

    try {
      const response = await CapacitorHttp.request(options);
      return response.data;
    } catch (error) {
      console.error('Erro ao autenticar usuário', error);
      throw error;
    }
  }

  async deletarUsuario(id: number) {
    const options = {
      url: this.server + 'user/delete?id=' + id,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await CapacitorHttp.request(options);
      return response.data;
    } catch (error) {
      console.error('Erro ao deletar usuário', error);
      throw error;
    }
  }

  async armazenarUsuario(email: any) {
    sessionStorage.setItem('email', email.toString());
  }

  getUsuario() {
    return sessionStorage.getItem('email');
  }

  async obterFazenda(idUsuario: any) {
    const options = {
      url: this.server + 'farm?id=' + idUsuario,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await CapacitorHttp.request(options);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter fazenda', error);
      throw error;
    }
  }

  // async getFazendaFuncionario(idFuncionario: any) {
  //   const options = {
  //     url: this.server + 'farm/employer?id=' + idFuncionario,
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   };

  //   try {
  //     const response = await CapacitorHttp.request(options);
  //     return response.data;
  //   } catch (error) {
  //     console.error('Erro ao obter fazenda', error);
  //     throw error;
  //   }
  // }

  async obterFazendaFuncionario(idFarm: number) {
    const options = {
      url: this.server + 'employer/farm?id=' + idFarm,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await CapacitorHttp.request(options);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter fazenda', error);
      throw error;
    }
  }


  async addFazenda(nome: any, cep: any, endereco: any, valor: any, id: any) {
    const options = {
      url: this.server + 'farm/add',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({ nome, cep, endereco, valor, id }), // Certifique-se de que os dados estão sendo convertidos em JSON
    };

    try {
      const response = await CapacitorHttp.request(options);
      return response.data; // Verifique se a resposta tem a estrutura correta
    } catch (error) {
      console.error('Erro ao adicionar ela no banco', error);
      throw error; // Joga o erro para ser tratado no front-end
    }
  }

  async deletarFazenda(idfazendas: number) {
    console.log('ID da Fazenda:', idfazendas); // Verifique se o ID está correto
    const options = {
      url: this.server + 'delete?idfazendas=' + idfazendas,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',

      },
    };

    try {
      const response = await CapacitorHttp.request(options);
      return response.data;
    } catch (error) {
      console.error('Erro ao deletar fazenda', error);
      throw error;
    }
  }


  async obterFuncionarios(id: any) {
    const options = {
      url: this.server + 'employees?id=' + id,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await CapacitorHttp.request(options);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter funcionários', error);
      throw error;
    }
  }

  async addFuncionarios(nome: any, cpf: any, email: any, telefone: any, salario: any, senha: any, idFazenda: number, idUsuario: number) {
    const options = {
      url: this.server + 'employees/add',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({
        nome,
        cpf,
        email,
        telefone,
        salario,
        senha,
        idfazendas: idFazenda,  // Alterado para corresponder ao back-end
        idusuario: idUsuario     // Alterado para corresponder ao back-end
      }),
    };

    try {
      const response = await CapacitorHttp.request(options);
      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar funcionário', error);
      throw error;
    }
  }


  async editarFuncionarios(idfuncionario: any, nome: any, cpf: any, email: any, telefone: any, salario: any, idFazenda: any) {
    const options = {
      url: this.server + 'employees/update',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      // Inclui idFazenda e id (em vez de idfuncionario)
      data: JSON.stringify({ id: idfuncionario, nome, cpf, email, telefone, salario, idFazenda }),
    };

    try {
      const response = await CapacitorHttp.request(options);
      return response.data;
    } catch (error) {
      console.error('Erro ao editar funcionário', error);
      throw error;
    }
  }


  async deletarFuncionarios(id: number) {
    const options = {
      url: this.server + 'employees/delete?id=' + id,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await CapacitorHttp.request(options);
      return response.data;
    } catch (error) {
      console.error('Erro ao deletar funcionário', error);
      throw error;
    }
  }

  async editarFazenda(nome: any, cep: any, endereco: any, valor: number, id: any) {
    const options = {
      url: this.server + 'farm/update',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({ nome, cep, endereco, valor, id }),
    };

    try {
      const response = await CapacitorHttp.request(options);
      return response.data;
    } catch (error) {
      console.error('Erro ao editar fazenda', error);
      throw error;
    }
  }

  // Função para adicionar equipamentos
  async addEquipamento(nome: string) {
    const options = {
      url: this.server + 'equipaments/add',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({ nome })
    };

    try {
      const response = await CapacitorHttp.request(options);
      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar equipamento', error);
      throw error;
    }
  }

  // Função para adicionar insumos
  async addInsumo(nome: string, unidade: string) {
    const options = {
      url: this.server + 'insum/add',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({ nome, unidade })
    };

    try {
      const response = await CapacitorHttp.request(options);
      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar insumo', error);
      throw error;
    }
  }

  async obterEquipamentos() {
    const options = {
      url: this.server + 'equipaments',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await CapacitorHttp.request(options);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter equipamento', error);
      throw error;
    }
  }

  async obterInsumos() {
    const options = {
      url: this.server + 'insum',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await CapacitorHttp.request(options);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter insumos', error);
      throw error;
    }
  }

  async obterInsumosProprietario(idUsuario: number) {
    const options = {
      url: this.server + 'insum/owner?id=' + idUsuario,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await CapacitorHttp.request(options);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter insumos do proprietário', error);
      throw error;
    }
  }

  async obterEquipamentosProprietario(idUsuario: number) {
    const options = {
      url: this.server + 'equipaments/owner?id=' + idUsuario,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await CapacitorHttp.request(options);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter equipamentos do proprietário', error);
      throw error;
    }
  }

  async adicionarEquipamentos(quantidade: number, valor: number, idFazenda: number, idUsuario: number, idEquipamento: number) {
    const options = {
      url: this.server + 'farm/equipaments/add',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({ quantidade, valor, idFazenda, idUsuario, idEquipamento })
    };

    try {
      const response = await CapacitorHttp.request(options);
      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar equipamento', error);
      throw error;
    }
  }


  async adicionarInsumos(quantidade: number, valor: number, idFazenda: number, idUsuario: number, idInsumo: number) {
    const options = {
      url: this.server + 'farm/insum/add',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({ quantidade, valor, idFazenda, idUsuario, idInsumo })
    };

    try {
      const response = await CapacitorHttp.request(options);
      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar insumo', error);
      throw error;
    }
  }

  async deletarEquipamento(id: number) {
    const options = {
      url: this.server + 'equipaments/delete?id=' + id,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await CapacitorHttp.request(options);
      return response.data;
    } catch (error) {
      console.error('Erro ao deletar equipamento', error);
      throw error;
    }
  }

  async editarInsumo(quantidade: number, valor: number, id: number, idFazenda: number, idUsuario: number, idInsumo: number) {
    const options = {
      url: this.server + 'farm/insum/update',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({ quantidade, valor, id, idFazenda, idUsuario, idInsumo })
    };

    try {
      const response = await CapacitorHttp.request(options);
      return response.data;
    } catch (error) {
      console.error('Erro ao editar insumo', error);
      throw error;
    }
  }


  async editarSolicitacaoInsumo(quantidade: number, valor: number, idFazenda: number, idFuncionario: number, idInsumo: number, idSolicitacao: number) {
    const options = {
      url: this.server + 'solicit/insum/update',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({ quantidade, valor, idFazenda, idFuncionario, idInsumo, idSolicitacao })
    };

    try {
      const response = await CapacitorHttp.request(options);
      return response.data;
    } catch (error) {
      console.error('Erro ao editar Solicitação de insumo', error);
      throw error;
    }
  }

  async excluirSolicitacaoInsumo(idSolicitacao: number) {
    const options = {
      url: this.server + 'solicit/insum/delete?id=' + idSolicitacao,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({ idSolicitacao })
    };

    try {
      const response = await CapacitorHttp.request(options);
      return response.data;
    } catch (error) {
      console.error('Erro ao editar Solicitação de insumo', error);
      throw error;
    }
  }

  async editarEquipamento(quantidade: number, valor: number, id: number, idFazenda: number, idUsuario: number, idEquipamento: number) {
    const options = {
      url: this.server + 'farm/equipaments/update',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({ quantidade, valor, id, idFazenda, idUsuario, idEquipamento })
    };

    try {
      const response = await CapacitorHttp.request(options);
      return response.data;
    } catch (error) {
      console.error('Erro ao editar equipamento', error);
      throw error;
    }
  }

  async deletarInsumo(id: number) {
    const options = {
      url: this.server + 'insum/delete?id=' + id,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await CapacitorHttp.request(options);
      return response.data;
    } catch (error) {
      console.error('Erro ao deletar insumo', error);
      throw error;
    }
  }

  async listarSolicitacoesInsumo(idFazenda: any) {
    const options = {
      url: this.server + 'solicit/insum?id=' + idFazenda,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await CapacitorHttp.request(options);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar solicitações', error);
      throw error;
    }
  }

  async listarSolicitacoesEquipamento(idFazenda: any) {
    const options = {
      url: this.server + 'solicit/equipament?id=' + idFazenda,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await CapacitorHttp.request(options);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar solicitações', error);
      throw error;
    }
  }

  //fazer rota
  async solicitarInsumo(quantidade: number, valor: number, idFuncionario: number, idFazenda: number, idUsuario: number, insumType: string, idInsumo: number) {
    const options = {
      url: this.server + 'solicit/insum/add',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({ quantidade, valor, idFuncionario, idFazenda, idUsuario, insumType, idInsumo })
    };

    try {
      const response = await CapacitorHttp.request(options);
      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar insumo', error);
      throw error;
    }
  }

  async solicitarEquipamentos(quantidade: number, valor: number, idFuncionario: number, idFazenda: number, idUsuario: number, equipType: string, idEquipamento: number) {
    const options = {
      url: this.server + 'solicit/equipaments/add',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({ quantidade, valor, idFuncionario, idFazenda, idUsuario, equipType, idEquipamento })
    };

    try {
      const response = await CapacitorHttp.request(options);
      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar equipamento', error);
      throw error;
    }
  }

  async editarSolicitacaoEquipamento(quantidade: number, valor: number, idFazenda: number, idFuncionario: number, idEquipamento: number, idSolicitacao: number) {
    const options = {
      url: this.server + 'solicit/equipament/update',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({ quantidade, valor, idFazenda, idFuncionario, idEquipamento, idSolicitacao })
    };

    try {
      const response = await CapacitorHttp.request(options);
      return response.data;
    } catch (error) {
      console.error('Erro ao editar Solicitação de insumo', error);
      throw error;
    }
  }

  async excluirSolicitacaoEquipamento(idSolicitacao: number) {
    const options = {
      url: this.server + 'solicit/equipament/delete?id=' + idSolicitacao,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({ idSolicitacao })
    };

    try {
      const response = await CapacitorHttp.request(options);
      return response.data;
    } catch (error) {
      console.error('Erro ao editar Solicitação de equipamento', error);
      throw error;
    }
  }

  async aceitarSolicitacao(idSolicitacao: number, quantidade: number, valor: any, idFazenda: number, idUsuario: number, idEquipamentoOrInsumo: number, tipo: string) {
    const options = {
      url: this.server + 'solicit/accept',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({ idSolicitacao, quantidade, valor, idFazenda, idUsuario, idEquipamentoOrInsumo, tipo })
    }
    try {
      const response = await CapacitorHttp.request(options);
      return response.data;
    } catch (error) {
      console.error('Erro ao aceitar esta solicitação', error);
      throw error;
    }
  }

  async recusarSolicitacao(idSolicitacao: number) {
    const options = {
      url: this.server + 'solicit/refuse',
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({ id: idSolicitacao }) // Usando a chave "id" para corresponder ao back-end
    };

    try {
      const response = await CapacitorHttp.request(options);
      return response.data;
    } catch (error) {
      console.error('Erro ao recusar solicitação', error);
      throw error;
    }
  }

  async salvarConsumo(id: number, quantidadeConsumida: number, valor: number, quantidadeAtual: number, custoTotal: any, idFazenda: number, idFuncionario: number, idUsuario: number, idInsumoOrEquipamento: number, tipo: string) {
    const options = {
      url: this.server + 'farm/consumption/add',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({ id, quantidadeConsumida, valor, quantidadeAtual, custoTotal, idFazenda, idFuncionario, idUsuario, idInsumoOrEquipamento, tipo })
    };

    try {
      const response = await CapacitorHttp.request(options);
      return response.data;
    } catch (error) {
      console.error('Erro ao salvar consumo', error);
      throw error;
    }
  }

  async obterConsumo(idfazendas: any) {
    const options = {
      url: this.server + 'farm/consumption?id=' + idfazendas,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await CapacitorHttp.request(options);
      return response.data;
    }
    catch (error) {
      console.error('Erro ao obter consumo', error);
      throw error;
    }
  }



  async obterGastos(id: any) {
    const options = {
      url: this.server + 'expenses?id=' + id,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await CapacitorHttp.request(options);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter gastos', error);
      throw error;
    }
  }

  async obterGastosMensais(id: any, year: number) {
    const options = {
      url: `${this.server}expenses/monthly?id=${id}&year=${year}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await CapacitorHttp.request(options);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter gastos mensais', error);
      throw error;
    }
  }

  async obterSolicitacaoConsumoEstoque(id: any, year: number) {
    const options = {
      url: `${this.server}solicit/consumption?id=${id}&year=${year}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await CapacitorHttp.request(options);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter solicitações de consumo', error);
      throw error;
    }
  }

  async excluirConta(id: any, perfil: any) {
    const options = {
        url: this.server + 'conta/delete?id=' + id + '&perfil=' + perfil,
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    };
    try {
        const response = await CapacitorHttp.request(options);
        return response.data;
    } catch (error) {
        console.error('Erro ao deletar conta', error);
        throw error;
    }
  }

  async resetarSenha(nome: any, email: any, token:any) {
    const options = {
      url: this.server + 'user/reset',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({ nome, email, token }),
    };

    try {
      const response = await CapacitorHttp.request(options);
      return response.data;
    } catch (error) {
      console.error('Erro ao resetar senha', error);
      throw error;
    }
  }

  async enviarResetEmail(email: any, perfil: any) {
    const options = {
      url: this.server + 'user/reset/email',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({ email, perfil }),
    };

    try {
      const response = await CapacitorHttp.request(options);
      return response.data;
    } catch (error) {
      console.error('Erro ao enviar email de reset', error);
      throw error;
    }
  }

  async verificarToken(token: any) {
    const options = {
      url: this.server + 'user/verify?token=' + token,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await CapacitorHttp.request(options);
      return response.data;
    } catch (error) {
      console.error('Erro ao verificar token', error);
      throw error;
    }
  }

  async resetPassword(email: any, perfil: any, token: any, senha:any,) {
    const options = {
      url: this.server + 'user/reset/password',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({ email, perfil, token, senha }),
    };

    try {
      const response = await CapacitorHttp.request(options);
      return response.data;
    } catch (error) {
      console.error('Erro ao resetar senha', error);
      throw error;
    }
  }





}
