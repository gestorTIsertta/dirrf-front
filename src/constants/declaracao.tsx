import {
  Home as HomeIcon,
  DirectionsCar as CarIcon,
  TrendingUp as TrendingUpIcon,
  CurrencyBitcoin as BitcoinIcon,
  Diamond as DiamondIcon,
  Business as BusinessIcon,
  AccountBalance as AccountBalanceIcon,
  CorporateFare as CorporateFareIcon,
  Agriculture as AgricultureIcon,
} from '@mui/icons-material';

export const COLORS = {
  primary: '#900B0D',
  primaryDark: '#720A10',
  success: '#22C55E',
  successLight: '#D3FCD2',
  warning: '#FFAB00',
  warningLight: '#FFF5CC',
  error: '#FF5630',
  errorLight: '#FFE9D5',
  grey100: '#F9FAFB',
  grey200: '#F4F6F8',
  grey600: '#637381',
  grey800: '#212B36',
};

export const categorias = [
  {
    id: 'imoveis',
    titulo: 'Imóveis',
    descricao: 'Clique para informar compras/vendas de imóveis em 2024.',
    imagemUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=220&fit=crop',
    icon: <HomeIcon />,
    color: '#2196F3',
  },
  {
    id: 'veiculos',
    titulo: 'Veículos',
    descricao: 'Informe compras/vendas de carros, motos e caminhões.',
    imagemUrl: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=220&fit=crop',
    icon: <CarIcon />,
    color: '#F44336',
  },
  {
    id: 'investimentos',
    titulo: 'Investimentos',
    descricao: 'Ações, FIIs, renda fixa e outros investimentos.',
    imagemUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=220&fit=crop',
    icon: <TrendingUpIcon />,
    color: '#4CAF50',
  },
  {
    id: 'cripto',
    titulo: 'Criptomoedas',
    descricao: 'Bitcoin, Ethereum e outras criptomoedas.',
    imagemUrl: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400&h=220&fit=crop',
    icon: <BitcoinIcon />,
    color: '#FF9800',
  },
  {
    id: 'bens',
    titulo: 'Bens de Alto Valor',
    descricao: 'Máquinas, equipamentos, embarcações e aeronaves.',
    imagemUrl: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=400&h=220&fit=crop',
    icon: <DiamondIcon />,
    color: '#9C27B0',
  },
  {
    id: 'outros',
    titulo: 'Outros Bens',
    descricao: 'Joias, obras de arte e outros bens valiosos.',
    imagemUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=220&fit=crop',
    icon: <BusinessIcon />,
    color: '#607D8B',
  },
  {
    id: 'emprestimos',
    titulo: 'Empréstimos',
    descricao: 'Empréstimos e financiamentos obtidos ou concedidos.',
    imagemUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=220&fit=crop',
    icon: <AccountBalanceIcon />,
    color: '#E91E63',
  },
  {
    id: 'participacoes',
    titulo: 'Participações em Empresas',
    descricao: 'Participações societárias e investimentos em empresas.',
    imagemUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=220&fit=crop',
    icon: <CorporateFareIcon />,
    color: '#3F51B5',
  },
  {
    id: 'atividade-rural',
    titulo: 'Atividade Rural',
    descricao: 'Atividades rurais, empréstimos rurais e bens da atividade.',
    imagemUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&h=220&fit=crop',
    icon: <AgricultureIcon />,
    color: '#4CAF50',
  },
];

export const documentosMock = [
  {
    id: 1,
    nome: 'Contrato_Compra_Imovel_Rua_das_Flores.pdf',
    categoria: 'Imóveis',
    tamanho: '2,4 MB',
    status: 'Enviado',
    info: 'Enviado há 2 dias',
  },
  {
    id: 2,
    nome: 'Nota_Fiscal_Veiculo_Honda_Civic.jpg',
    categoria: 'Veículos',
    tamanho: '1,8 MB',
    status: 'Em análise',
    info: 'Enviado há 5 dias',
  },
  {
    id: 3,
    nome: 'Extrato_Corretora_Investimentos_2024.pdf',
    categoria: 'Investimentos',
    tamanho: '3,2 MB',
    status: 'Aprovado',
    info: 'Enviado há 1 semana',
  },
  {
    id: 4,
    nome: 'Comprovante_Compra_Bitcoin_Exchange.png',
    categoria: 'Criptomoedas',
    tamanho: '890 KB',
    status: 'Enviado',
    info: 'Enviado há 3 dias',
  },
];

const criarArquivoExemplo = (nome: string, tipo: string = 'application/pdf'): File => {
  const blob = new Blob(['Conteúdo do arquivo de exemplo'], { type: tipo });
  return new File([blob], nome, { type: tipo, lastModified: Date.now() });
};

export const itensMock = [
  {
    id: 1,
    categoria: 'Imóveis',
    tipo: 'Apartamento',
    operacao: 'Compra',
    data: '15/03/2024',
    valor: '450.000,00',
    comprovante: true,
    comprovanteFile: criarArquivoExemplo('Comprovante_Compra_Apartamento.pdf'),
    status: 'Completo',
  },
  {
    id: 2,
    categoria: 'Veículos',
    tipo: 'Automóvel',
    operacao: 'Venda',
    data: '22/05/2024',
    valor: '68.500,00',
    comprovante: true,
    comprovanteFile: criarArquivoExemplo('Comprovante_Venda_Automovel.pdf'),
    status: 'Em análise',
  },
  {
    id: 3,
    categoria: 'Investimentos',
    tipo: 'Ações',
    operacao: 'Compra e Venda',
    data: '10/08/2024',
    valor: '125.800,00',
    comprovante: true,
    comprovanteFile: criarArquivoExemplo('Comprovante_Acoes_2024.pdf'),
    status: 'Completo',
  },
  {
    id: 4,
    categoria: 'Criptomoedas',
    tipo: 'Bitcoin',
    operacao: 'Compra',
    data: '05/11/2024',
    valor: '45.200,00',
    comprovante: true,
    comprovanteFile: criarArquivoExemplo('Comprovante_Bitcoin.pdf'),
    status: 'Completo',
  },
  {
    id: 5,
    categoria: 'Imóveis',
    tipo: 'Terreno',
    operacao: 'Venda',
    data: '18/09/2024',
    valor: '280.000,00',
    comprovante: false,
    status: 'Faltando info',
  },
  {
    id: 6,
    categoria: 'Investimentos',
    tipo: 'FII',
    operacao: 'Compra',
    data: '30/06/2024',
    valor: '32.400,00',
    comprovante: true,
    comprovanteFile: criarArquivoExemplo('Comprovante_FII.pdf'),
    status: 'Completo',
  },
];

export const checklistItems = [
  {
    titulo: 'Revisei todos os meus rendimentos',
    desc: 'Verifique se todos os salários, aluguéis e outras fontes de renda foram informados corretamente.',
  },
  {
    titulo: 'Informei corretamente meus bens e direitos',
    desc: 'Confirme que todos os imóveis, veículos e investimentos estão declarados com valores atualizados.',
  },
  {
    titulo: 'Anexei os comprovantes necessários',
    desc: 'Certifique-se de que todos os documentos obrigatórios foram enviados e estão legíveis.',
  },
  {
    titulo: 'Verifiquei as informações de dependentes',
    desc: 'Confirme os dados de CPF, data de nascimento e grau de parentesco dos dependentes.',
  },
  {
    titulo: 'Conferi as deduções permitidas',
    desc: 'Revise despesas médicas, educação e outras deduções que podem reduzir o imposto.',
  },
];

export const timelineSteps = [
  {
    label: 'Declaração iniciada',
    desc: 'Você começou a preencher sua declaração de imposto de renda.',
    data: '10/01/2024',
    done: true,
  },
  {
    label: 'Dados pessoais confirmados',
    desc: 'Informações cadastrais e de dependentes foram verificadas.',
    data: '12/01/2024',
    done: true,
  },
  {
    label: 'Em preenchimento',
    desc: 'Complete as informações de bens, direitos e operações realizadas.',
    data: 'Atual',
    done: false,
    current: true,
  },
  {
    label: 'Enviado para análise',
    desc: 'Aguardando envio da declaração completa para a contabilidade.',
    data: 'Pendente',
    done: false,
  },
  {
    label: 'Revisão contábil',
    desc: 'Nossa equipe irá revisar todos os dados e documentos enviados.',
    data: 'Pendente',
    done: false,
  },
  {
    label: 'Transmitida à Receita Federal',
    desc: 'Declaração será enviada oficialmente para a Receita Federal.',
    data: 'Pendente',
    done: false,
  },
];

