import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Cliente } from '../models/cliente';
import { ClienteService } from '../../services/cliente.service';

// Define apenas o formato dos dados de município retornados pela API do IBGE.
// Uma interface existe para ajudar o TypeScript e não gera código no navegador.
interface Municipio {
  id: number;
  nome: string;
}

/*
 * Componente responsável pela página de cadastro e edição de clientes.
 * A consulta fica no ListaComponent, e os dados compartilhados entre as duas
 * páginas ficam no ClienteService.
 */
@Component({
  selector: 'app-cadastro-clientes',
  standalone: true,
  imports: [
    // CommonModule fornece recursos comuns de template do Angular.
    CommonModule,
    // ReactiveFormsModule permite usar formGroup, formControlName e FormControl.
    ReactiveFormsModule
  ],
  templateUrl: './cadastro-cliente.component.html',
  styleUrl: './cadastro-cliente.component.css'
})
export class CadastroClienteComponent {

  // FormGroup reúne e gerencia todos os campos do formulário de cliente.
  formularioCliente: FormGroup;

  // Opções carregadas da API do IBGE para a UF selecionada.
  municipios: Municipio[] = [];

  // Informa à tela que existe uma requisição em andamento.
  carregandoMunicipios = false;

  // Guarda uma mensagem amigável caso a consulta ao IBGE não possa ser concluída.
  erroMunicipios = '';

  /*
   * Cada consulta recebe um número. Se a pessoa trocar de UF muito rápido, uma
   * resposta antiga pode chegar depois da nova. Este contador permite ignorar
   * essa resposta atrasada e evita mostrar municípios do estado errado.
   */
  private numeroConsultaMunicipios = 0;

  // null significa "novo cadastro"; um id significa "edição em andamento".
  clienteEditandoId: string | null = null;

  // Lista fixa das siglas das 27 unidades federativas brasileiras.
  ufs: string[] = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF',
    'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA',
    'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS',
    'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  constructor(
    // O Angular injeta estas dependências automaticamente.
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private clienteService: ClienteService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    /*
     * Cria os controles do formulário. Cada item contém o valor inicial e suas
     * regras de validação. Por exemplo, nome é obrigatório e precisa ter ao
     * menos três caracteres.
     */
    this.formularioCliente = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', [Validators.required]],
      dataNascimento: ['', [Validators.required]],
      uf: ['', [Validators.required]],
      // O município começa desabilitado e só é liberado após selecionar uma UF.
      municipio: [{ value: '', disabled: true }, [Validators.required]]
    });

    // Quando a UF muda, busca os municípios correspondentes.
    // "?." só continua se o controle "uf" realmente existir.
    this.formularioCliente.get('uf')?.valueChanges.subscribe(uf => {
      this.carregarMunicipios(uf);
    });

    /*
     * A rota /cadastro/:id possui um parâmetro chamado id. Quando ele existe,
     * buscamos o cliente no serviço e preenchemos o formulário para edição.
     */
    this.route.paramMap.subscribe(parametros => {
      const id = parametros.get('id');

      if (id) {
        const cliente = this.clienteService.buscarPorId(id);

        if (cliente) {
          this.editarCliente(cliente);
        } else {
          // Um id inexistente não pode ser editado; voltamos para a consulta.
          this.router.navigate(['/consulta']);
        }
      }
    });
  }

  /**
   * Busca na API do IBGE os municípios pertencentes à UF selecionada.
   * O segundo parâmetro é usado na edição para restaurar o município do cliente.
   */
  carregarMunicipios(uf: string, municipioSelecionado = ''): void {
    const consultaAtual = ++this.numeroConsultaMunicipios;
    const controleMunicipio = this.formularioCliente.get('municipio');

    // Remove opções da seleção anterior para não misturar estados diferentes.
    this.municipios = [];
    this.erroMunicipios = '';

    // Também limpa o município escolhido anteriormente. emitEvent: false evita
    // disparar eventos desnecessários durante essa limpeza feita pelo código.
    controleMunicipio?.reset('', {
      emitEvent: false
    });

    // Enquanto não há opções válidas, o select fica bloqueado.
    controleMunicipio?.disable({ emitEvent: false });

    // Sem UF não existe nada para consultar, então encerramos o método cedo.
    if (!uf) {
      this.carregandoMunicipios = false;
      return;
    }

    this.carregandoMunicipios = true;

    const url =
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`;

    /*
     * get faz uma requisição HTTP GET. O tipo <Municipio[]> informa qual formato
     * esperamos receber. Como a resposta chega depois, subscribe define o que
     * fazer no sucesso (next) e na falha (error).
     */
    this.http.get<Municipio[]>(url).subscribe({
      next: municipios => {
        // Se outra UF já foi escolhida, esta resposta ficou velha e é descartada.
        if (consultaAtual !== this.numeroConsultaMunicipios) {
          return;
        }

        // localeCompare ordena corretamente os nomes em ordem alfabética.
        this.municipios = municipios.sort((a, b) =>
          a.nome.localeCompare(b.nome)
        );

        // Agora existem opções compatíveis com a UF e o campo pode ser usado.
        controleMunicipio?.enable({ emitEvent: false });

        // Durante uma edição, seleciona novamente o município salvo do cliente.
        if (municipioSelecionado) {
          controleMunicipio?.setValue(municipioSelecionado, {
            emitEvent: false
          });
        }

        this.carregandoMunicipios = false;
      },

      error: erro => {
        // Uma resposta antiga também não deve sobrescrever o estado da consulta atual.
        if (consultaAtual !== this.numeroConsultaMunicipios) {
          return;
        }

        console.error('Erro ao carregar municípios:', erro);

        this.municipios = [];
        this.erroMunicipios =
          'Não foi possível carregar os municípios. Tente selecionar a UF novamente.';
        this.carregandoMunicipios = false;
      }
    });
  }

  /** Valida o formulário, cria um cliente e o adiciona à lista em memória. */
  cadastrarCliente(): void {
    // Se alguma regra falhar, mostra os erros e interrompe o cadastro.
    if (this.formularioCliente.invalid) {
      this.formularioCliente.markAllAsTouched();
      return;
    }

    const cliente = new Cliente();

    // Gera um identificador único para diferenciar clientes, mesmo com nomes iguais.
    cliente.id = crypto.randomUUID();

    // Copia os valores digitados do FormGroup para o objeto Cliente.
    cliente.nome = this.formularioCliente.value.nome;
    cliente.email = this.formularioCliente.value.email;
    cliente.cpf = this.formularioCliente.value.cpf;
    cliente.dataNascimento =
      this.formularioCliente.value.dataNascimento;
    cliente.uf = this.formularioCliente.value.uf;
    cliente.municipio =
      this.formularioCliente.value.municipio;

    // O serviço compartilhado torna o cadastro visível também na página de consulta.
    this.clienteService.adicionar(cliente);
    this.limparFormulario();
    this.router.navigate(['/consulta']);
  }

  /** Preenche o formulário com um cliente e muda a tela para o modo de edição. */
  editarCliente(cliente: Cliente): void {
    this.clienteEditandoId = cliente.id;

    // patchValue altera apenas os campos informados, preservando os demais.
    // emitEvent: false impede que a mudança da UF faça uma consulta duplicada.
    this.formularioCliente.patchValue({
      nome: cliente.nome,
      email: cliente.email,
      cpf: cliente.cpf,
      dataNascimento: cliente.dataNascimento,
      uf: cliente.uf
    }, { emitEvent: false });

    // Carrega as opções antes de restaurar o município salvo.
    this.carregarMunicipios(cliente.uf, cliente.municipio);
  }

  /** Substitui na lista os dados do cliente que está sendo editado. */
  atualizarCliente(): void {
    if (this.formularioCliente.invalid) {
      this.formularioCliente.markAllAsTouched();
      return;
    }

    // Cria o objeto atualizado e conserva o id original.
    // O "!" afirma ao TypeScript que aqui o id não é null, pois estamos editando.
    const clienteAtualizado: Cliente = {
      id: this.clienteEditandoId!,
      nome: this.formularioCliente.value.nome,
      email: this.formularioCliente.value.email,
      cpf: this.formularioCliente.value.cpf,
      dataNascimento:
        this.formularioCliente.value.dataNascimento,
      uf: this.formularioCliente.value.uf,
      municipio:
        this.formularioCliente.value.municipio
    };

    this.clienteService.atualizar(clienteAtualizado);
    this.limparFormulario();
    this.router.navigate(['/consulta']);
  }

  /** Volta o formulário e o estado da tela ao modo de novo cadastro. */
  limparFormulario(): void {
    // Invalida uma eventual resposta do IBGE que ainda esteja a caminho.
    this.numeroConsultaMunicipios++;

    // reset limpa os valores e também estados como touched e dirty.
    this.formularioCliente.reset();
    this.formularioCliente.get('municipio')?.disable({ emitEvent: false });
    this.clienteEditandoId = null;
    this.municipios = [];
    this.carregandoMunicipios = false;
    this.erroMunicipios = '';
  }
}
