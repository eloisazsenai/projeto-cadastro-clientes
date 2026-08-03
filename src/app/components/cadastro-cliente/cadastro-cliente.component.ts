import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Cliente } from '../models/cliente';

@Component({
  selector: 'app-cadastro-clientes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cadastro-cliente.component.html',
  styleUrl: './cadastro-cliente.component.css'
})
export class CadastroClienteComponent {

  formularioCliente: FormGroup;

  campoPesquisa = new FormControl('');

  listaClientes: Cliente[] = [];
  clientesFiltrados: Cliente[] = [];

  clienteEditandoId: string | null = null;

  ufs: string[] = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF',
    'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA',
    'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS',
    'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  constructor(private formBuilder: FormBuilder) {
    this.formularioCliente = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', [Validators.required]],
      dataNascimento: ['', [Validators.required]],
      uf: ['', [Validators.required]],
      municipio: ['', [Validators.required]]
    });

    this.campoPesquisa.valueChanges.subscribe(() => {
      this.pesquisarCliente();
    });
  }

  cadastrarCliente(): void {
    if (this.formularioCliente.invalid) {
      this.formularioCliente.markAllAsTouched();
      return;
    }

    const cliente = new Cliente();

    cliente.id = crypto.randomUUID();
    cliente.nome = this.formularioCliente.value.nome;
    cliente.email = this.formularioCliente.value.email;
    cliente.cpf = this.formularioCliente.value.cpf;
    cliente.dataNascimento =
      this.formularioCliente.value.dataNascimento;
    cliente.uf = this.formularioCliente.value.uf;
    cliente.municipio =
      this.formularioCliente.value.municipio;

    this.listaClientes.push(cliente);

    this.atualizarListaExibida();
    this.limparFormulario();
  }

  pesquisarCliente(): void {
    const termo =
      this.campoPesquisa.value?.trim().toLowerCase() ?? '';

    if (termo === '') {
      this.clientesFiltrados = [...this.listaClientes];
      return;
    }

    this.clientesFiltrados = this.listaClientes.filter(cliente =>
      cliente.nome.toLowerCase().includes(termo)
    );
  }

  limparPesquisa(): void {
    this.campoPesquisa.setValue('');
  }

  editarCliente(cliente: Cliente): void {
    this.clienteEditandoId = cliente.id;

    this.formularioCliente.patchValue({
      nome: cliente.nome,
      email: cliente.email,
      cpf: cliente.cpf,
      dataNascimento: cliente.dataNascimento,
      uf: cliente.uf,
      municipio: cliente.municipio
    });
  }

  atualizarCliente(): void {
    if (this.formularioCliente.invalid) {
      this.formularioCliente.markAllAsTouched();
      return;
    }

    const indice = this.listaClientes.findIndex(
      cliente => cliente.id === this.clienteEditandoId
    );

    if (indice === -1) {
      return;
    }

    this.listaClientes[indice] = {
      id: this.clienteEditandoId!,
      nome: this.formularioCliente.value.nome,
      email: this.formularioCliente.value.email,
      cpf: this.formularioCliente.value.cpf,
      dataNascimento:
        this.formularioCliente.value.dataNascimento,
      uf: this.formularioCliente.value.uf,
      municipio: this.formularioCliente.value.municipio
    };

    this.atualizarListaExibida();
    this.limparFormulario();
  }

  excluirCliente(id: string): void {
    this.listaClientes = this.listaClientes.filter(
      cliente => cliente.id !== id
    );

    this.atualizarListaExibida();
  }

  atualizarListaExibida(): void {
    this.pesquisarCliente();
  }

  limparFormulario(): void {
    this.formularioCliente.reset();
    this.clienteEditandoId = null;
  }
}