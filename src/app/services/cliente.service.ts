import { Injectable } from '@angular/core';
import { Cliente } from '../components/models/cliente';

/*
 * Um serviço guarda lógica e dados que precisam ser compartilhados entre
 * componentes diferentes. "providedIn: root" cria uma única instância deste
 * serviço para toda a aplicação; por isso cadastro e consulta enxergam a mesma
 * lista, mesmo estando em páginas diferentes.
 *
 * Esta lista ainda vive somente na memória. Recarregar o navegador apaga os
 * clientes; futuramente o serviço pode ser adaptado para conversar com uma API.
 */
@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private clientes: Cliente[] = [];

  /** Devolve uma cópia para outros componentes não alterarem o array sem querer. */
  listar(): Cliente[] {
    return [...this.clientes];
  }

  /** Procura um cliente pelo identificador usado na rota de edição. */
  buscarPorId(id: string): Cliente | undefined {
    return this.clientes.find(cliente => cliente.id === id);
  }

  adicionar(cliente: Cliente): void {
    this.clientes.push(cliente);
  }

  atualizar(clienteAtualizado: Cliente): boolean {
    const indice = this.clientes.findIndex(
      cliente => cliente.id === clienteAtualizado.id
    );

    if (indice === -1) {
      return false;
    }

    this.clientes[indice] = clienteAtualizado;
    return true;
  }

  excluir(id: string): void {
    this.clientes = this.clientes.filter(cliente => cliente.id !== id);
  }
}
