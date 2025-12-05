export interface CompraVenda {
  id: string;
  categoria: string;
  tipo: string;
  operacao: 'Compra' | 'Venda';
  data: string;
  valor: string;
  comprovante?: File | null;
}

export interface Documento {
  id: number;
  nome: string;
  categoria: string;
  tamanho: string;
  status: string;
  info: string;
}

export interface ItemDeclarado {
  id: number;
  categoria: string;
  tipo: string;
  operacao: string;
  data: string;
  valor: string;
  comprovante: boolean;
  status: string;
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
}

export interface ComprovanteData {
  compraVendaId: string;
  arquivo: File | null;
}

