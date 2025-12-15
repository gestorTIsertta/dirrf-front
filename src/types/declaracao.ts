export interface CompraVenda {
  id: string;
  categoria: string;
  tipo: string;
  operacao: 'Compra' | 'Venda';
  data: string;
  valor: string;
  comprovante?: File | null;
  comprovantesAnexados?: File[];
  bancoId: string;
}

export interface Documento {
  id: number | string;
  nome: string;
  categoria: string;
  tamanho: string;
  status: string;
  info: string;
  storagePath?: string;
  uploadedAt?: string;
}

export interface ItemDeclarado {
  id: number;
  categoria: string;
  tipo: string;
  operacao: string;
  data: string;
  valor: string;
  comprovante: boolean;
  comprovanteFile?: File | null;
  comprovantes?: Array<{
    fileName: string;
    storagePath: string;
    uploadedAt: string;
  }>;
  status: string;
  bancoId?: string;
}

export interface Categoria {
  id: string;
  titulo: string;
  descricao: string;
  imagemUrl: string;
  icon: React.ReactNode;
  color: string;
}

export interface FormDataCompraVenda {
  tipo: string;
  data: string;
  valor: string;
  descricao: string;
  comprovante: File | null;
  comprovantesAnexados: File[];
  comprovantesExistentes?: Array<{
    fileName: string;
    storagePath: string;
    uploadedAt: string;
  }>;
  bancoId: string;
}

export interface ComprovanteData {
  bancoId: string;
  arquivo: File | null;
}

export interface Emprestimo {
  id: string;
  data: string;
  bancoId: string;
  valor: string;
}

export interface ParticipacaoEmpresa {
  id: string;
  cnpj: string;
  razaoSocial: string;
  percentual: string;
}

export interface AtividadeRural {
  id: string;
  emprestimoRuralBancoId?: string;
  emprestimoRuralValor?: string;
  bensAtividadeRural?: string;
  fichaSanitaria?: File | null;
}

export interface Banco {
  id: string;
  nome: string;
  codigoCompe?: string;
  conta: string;
  agencia: string;
  tipo: 'Corrente' | 'Poupança';
  dataAbertura: string;
  informeRendimentos?: File | null;
  informeRendimentoMetadata?: {
    fileName: string;
    storagePath: string;
    uploadedAt: string;
  } | null;
  informeRemovido?: boolean;
}

export interface FormDataEmprestimo {
  data: string;
  bancoId: string;
  valor: string;
}

export interface FormDataParticipacao {
  cnpj: string;
  razaoSocial: string;
  percentual: string;
}

export interface FormDataAtividadeRural {
  emprestimoRuralBancoId: string;
  emprestimoRuralValor: string;
  bensAtividadeRural: string;
  fichaSanitaria: File | null;
  fichasAnexadas: File[];
}

export interface FormDataBanco {
  nome: string;
  conta: string;
  agencia: string;
  tipo: 'Corrente' | 'Poupança';
  dataAbertura: string;
  informeRendimentos: File | null;
  informesAnexados: File[];
  informeExistente?: {
    fileName: string;
    storagePath: string;
    uploadedAt: string;
    file: File;
  } | null;
}

export interface Dependente {
  id: string;
  nomeCompleto: string;
  cpf: string;
  dataNascimento: string;
  grauParentesco: string;
  nomeMae?: string;
  nacionalidade?: string;
  sexo?: 'Masculino' | 'Feminino' | 'Outro';
}

export interface FormDataDependente {
  nomeCompleto: string;
  cpf: string;
  dataNascimento: string;
  grauParentesco: string;
  nomeMae: string;
  nacionalidade: string;
  sexo: 'Masculino' | 'Feminino' | 'Outro' | '';
}

export interface ServicoTomado {
  id: string;
  nomePrestador: string;
  cpfCnpj: string;
  tipoServico: string;
  valorTotal: string;
  valorReembolsado?: string;
  observacoes?: string;
}

export interface FormDataServicoTomado {
  nomePrestador: string;
  cpfCnpj: string;
  tipoServico: string;
  valorTotal: string;
  valorReembolsado: string;
  observacoes: string;
}

