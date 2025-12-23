export interface DeclaracaoResumo {
  id: string;
  nome: string;
  cpf: string;
  status: 'Em preenchimento' | 'Aguardando conferência' | 'Enviado à Receita' | 'Finalizado';
  ano: number;
  resultado: string;
  resultadoTipo: 'pagar' | 'restituir';
  dataEnvio: string;
  responsavel: string;
  pendencias: string;
  tags?: string[];
}

export interface CardResumo {
  label: string;
  valor: number;
  diff: string;
  cor: string;
}

export interface CompraVenda {
  id: string;
  categoria: string;
  tipo: string;
  operacao: 'Compra' | 'Venda' | 'Compra e Venda';
  data: string;
  valor: string;
  origem: string;
  documento: boolean;
  status: 'Pendente' | 'Completo' | 'Em dúvida';
}

export interface DocumentoCliente {
  id: string;
  nome: string;
  status: 'Não revisado' | 'Aprovado' | 'Pendente' | 'Reprovado';
  tipo: string;
  enviado: string;
  tamanho: string;
  categoria: string;
}

export interface HistoricoItem {
  id: string;
  tipo: 'ok' | 'edit' | 'msg' | 'cliente' | 'novo';
  usuario: string;
  data: string;
  texto: string;
}

export interface Comentario {
  id: string;
  texto: string;
  autorNome: string;
  autorEmail: string;
  data: string;
  createdAt: string;
}





