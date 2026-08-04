/*
 * Modelo que descreve os dados de um cliente.
 *
 * A classe serve como um "molde": toda instância de Cliente começa com as
 * mesmas propriedades. Os tipos (string) ajudam o TypeScript a detectar usos
 * incorretos durante o desenvolvimento, antes que o código chegue ao navegador.
 * Os valores vazios evitam propriedades indefinidas ao criar new Cliente().
 */
export class Cliente {
  // Identificador único usado para localizar, editar ou excluir um cliente.
  id: string = '';
  nome: string = '';
  email: string = '';
  cpf: string = '';
  dataNascimento: string = '';
  uf: string = '';
  municipio: string = '';
}
