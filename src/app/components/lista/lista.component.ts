import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Cliente } from '../models/cliente';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-lista',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './lista.component.html',
  styleUrl: './lista.component.css'
})
export class ListaComponent {
  campoPesquisa = new FormControl('');
  clientesFiltrados: Cliente[] = [];

  constructor(
    private clienteService: ClienteService,
    private router: Router
  ) {
    this.atualizarLista();

    // Refaz o filtro automaticamente sempre que o texto pesquisado muda.
    this.campoPesquisa.valueChanges.subscribe(() => this.pesquisarCliente());
  }

  pesquisarCliente(): void {
    const termo = this.campoPesquisa.value?.trim().toLowerCase() ?? '';
    const clientes = this.clienteService.listar();

    this.clientesFiltrados = termo
      ? clientes.filter(cliente => cliente.nome.toLowerCase().includes(termo))
      : clientes;
  }

  limparPesquisa(): void {
    this.campoPesquisa.setValue('');
  }

  editarCliente(id: string): void {
    // O id na URL informa à página de cadastro qual cliente deve ser carregado.
    this.router.navigate(['/cadastro', id]);
  }

  excluirCliente(id: string): void {
    this.clienteService.excluir(id);
    this.atualizarLista();
  }

  private atualizarLista(): void {
    this.pesquisarCliente();
  }

}
