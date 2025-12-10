import bancosBrasileiros from 'bancos-brasileiros';

export interface BancoBrasileiro {
  COMPE: string;
  ISPB: string;
  Document: string;
  LongName: string;
  ShortName: string;
  Network?: string;
  Type?: string;
  PixType?: string;
  Charge?: boolean;
  CreditDocument?: boolean;
  LegalCheque?: boolean;
  DetectaFlow?: boolean;
  PCR?: boolean;
  PCRP?: boolean;
  SalaryPortability?: string;
  Products?: string[];
  Url?: string;
  DateOperationStarted?: string;
  DatePixStarted?: string;
  DateRegistered?: string;
  DateUpdated?: string;
}

export const BANCOS_BRASILEIROS: BancoBrasileiro[] = bancosBrasileiros as BancoBrasileiro[];

export const getBancoByCompe = (codigoCompe: string): BancoBrasileiro | undefined => {
  return BANCOS_BRASILEIROS.find((banco) => banco.COMPE === codigoCompe.padStart(3, '0'));
};

const NOMES_BANCOS_MAP: Record<string, string> = {
  'banco do brasil': '001',
  'banco do brasil s.a.': '001',
  'bb': '001',
  'bradesco': '237',
  'banco bradesco s.a.': '237',
  'caixa': '104',
  'caixa econômica federal': '104',
  'cef': '104',
  'itau': '341',
  'itaú': '341',
  'itau unibanco': '341',
  'banco itau s.a.': '341',
  'santander': '033',
  'banco santander brasil s.a.': '033',
  'banrisul': '041',
  'banco do estado do rio grande do sul s.a.': '041',
  'sicredi': '748',
  'banco cooperativo sicredi s.a.': '748',
  'inter': '077',
  'banco inter s.a.': '077',
  'nubank': '260',
  'nu pagamentos s.a.': '260',
  'original': '212',
  'banco original s.a.': '212',
  'neon': '113',
  'banco neon s.a.': '113',
  'neon corretora': '113',
  'c6 bank': '336',
  'banco c6 s.a.': '336',
  'pagseguro': '290',
  'pagseguro internet s.a.': '290',
  'mercado pago': '323',
  'mercado pago instituição de pagamento ltda': '323',
  'banco pan': '623',
  'banco pan s.a.': '623',
  'btg pactual': '208',
  'banco btg pactual s.a.': '208',
  'safra': '422',
  'banco safra s.a.': '422',
  'votorantim': '655',
  'banco votorantim s.a.': '655',
  'sicoob': '756',
  'banco cooperativo do brasil s.a.': '756',
};

export const getCodigoCompeByNome = (nome: string): string | null => {
  if (!nome || nome.trim() === '') {
    return null;
  }
  
  const nomeLower = nome.toLowerCase().trim();
  
  if (NOMES_BANCOS_MAP[nomeLower]) {
    return NOMES_BANCOS_MAP[nomeLower];
  }
  
  const chaveEncontrada = Object.keys(NOMES_BANCOS_MAP).find((chave) =>
    chave.includes(nomeLower) || nomeLower.includes(chave)
  );
  
  if (chaveEncontrada) {
    return NOMES_BANCOS_MAP[chaveEncontrada];
  }
  
  const bancoExato = BANCOS_BRASILEIROS.find(
    (banco) =>
      banco.LongName.toLowerCase() === nomeLower ||
      banco.ShortName.toLowerCase() === nomeLower ||
      banco.LongName.toLowerCase().replace(/[^a-z0-9]/g, '') === nomeLower.replace(/[^a-z0-9]/g, '')
  );
  
  if (bancoExato) {
    return bancoExato.COMPE;
  }
  
  const nomeNormalizado = nomeLower
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
  
  const bancoParcial = BANCOS_BRASILEIROS.find((banco) => {
    const longNameNormalizado = banco.LongName.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '');
    const shortNameNormalizado = banco.ShortName.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '');
    
    return (
      longNameNormalizado.includes(nomeNormalizado) ||
      shortNameNormalizado.includes(nomeNormalizado) ||
      nomeNormalizado.includes(longNameNormalizado) ||
      nomeNormalizado.includes(shortNameNormalizado)
    );
  });
  
  return bancoParcial?.COMPE || null;
};

export const getBancoOptions = () => {
  return BANCOS_BRASILEIROS.map((banco) => ({
    label: banco.LongName,
    value: banco.LongName,
    codigo: banco.COMPE,
  }));
};

export const getBancoOptionsOrdenados = () => {
  const bancos = getBancoOptions();
  const bancosComImagemEspecifica: Array<{ label: string; value: string; codigo: string }> = [];
  const bancosComImagemGenerica: Array<{ label: string; value: string; codigo: string }> = [];

  bancos.forEach((banco) => {
    const codigo = banco.codigo.padStart(3, '0');
    const temImagemEspecifica = BANCOS_IMAGENS_MAP[codigo] !== undefined;
    if (temImagemEspecifica) {
      bancosComImagemEspecifica.push(banco);
    } else {
      bancosComImagemGenerica.push(banco);
    }
  });

  const ordenarAlfabetico = (a: { label: string }, b: { label: string }) => {
    return a.label.localeCompare(b.label, 'pt-BR', { sensitivity: 'base' });
  };

  bancosComImagemEspecifica.sort(ordenarAlfabetico);
  bancosComImagemGenerica.sort(ordenarAlfabetico);

  return [...bancosComImagemEspecifica, ...bancosComImagemGenerica];
};

const BANCOS_IMAGENS_MAP: Record<string, string> = {
  '001': '/Bancos-em-SVG-main/Banco do Brasil S.A/banco-do-brasil-sem-fundo.svg',
  '237': '/Bancos-em-SVG-main/Bradesco S.A/bradesco.svg',
  '104': '/Bancos-em-SVG-main/Caixa Econômica Federal/caixa-economica-federal-X.svg',
  '341': '/Bancos-em-SVG-main/Itaú Unibanco S.A/itau.svg',
  '033': '/Bancos-em-SVG-main/Banco Santander Brasil S.A/banco-santander-logo.svg',
  '041': '/Bancos-em-SVG-main/Banrisul/banrisul-logo-2023.svg',
  '748': '/Bancos-em-SVG-main/Sicredi/logo-svg2.svg',
  '077': '/Bancos-em-SVG-main/Banco Inter S.A/inter.svg',
  '260': '/Bancos-em-SVG-main/Nu Pagamentos S.A/nubank-logo-2021.svg',
  '212': '/Bancos-em-SVG-main/Banco Original S.A/banco-original-logo-verde.svg',
  '113': '/Bancos-em-SVG-main/Neon/header-logo-neon.svg',
  '336': '/Bancos-em-SVG-main/Banco C6 S.A/c6 bank.svg',
  '290': '/Bancos-em-SVG-main/PagSeguro Internet S.A/logo.svg',
  '323': '/Bancos-em-SVG-main/Mercado Pago/mercado-pago.svg',
  '208': '/Bancos-em-SVG-main/Banco BTG Pacutal/btg-pactual.svg',
  '422': '/Bancos-em-SVG-main/Banco Safra S.A/logo-safra.svg',
  '655': '/Bancos-em-SVG-main/Banco Votorantim/banco-bv-logo.svg',
  '756': '/Bancos-em-SVG-main/Sicoob/sicoob-vector-logo.svg',
  '102': '/Bancos-em-SVG-main/XP Investimentos/xp-investimentos-logo.svg',
  '197': '/Bancos-em-SVG-main/Stone Pagamentos S.A/stone.svg',
  '079': '/Bancos-em-SVG-main/PicPay/Logo-PicPay.svg',
  '070': '/Bancos-em-SVG-main/BRB - Banco de Brasilia/brb-logo.svg',
  '003': '/Bancos-em-SVG-main/Banco da Amazônia S.A/banco-da-amazonia.svg',
  '389': '/Bancos-em-SVG-main/Banco Mercantil do Brasil S.A/banco-mercantil-novo-azul.svg',
  '637': '/Bancos-em-SVG-main/Banco Sofisa/logo-sofisa.svg',
  '707': '/Bancos-em-SVG-main/Banco Daycoval/logo-Daycoval-com-fundo.svg',
  '233': '/Bancos-em-SVG-main/Banco BMG/banco-bmg-logo.svg',
  '643': '/Bancos-em-SVG-main/Banco Pine/banco-pine.svg',
  '633': '/Bancos-em-SVG-main/Banco Rendimento/banco rendimento logo nova .svg',
  '611': '/Bancos-em-SVG-main/Banco Paulista/banco-paulista.svg',
  '021': '/Bancos-em-SVG-main/Banco do Estado do Espirito Santo/banestes.svg',
  '037': '/Bancos-em-SVG-main/Banco do Estado do Para/banpara-logo-fundo.svg',
  '047': '/Bancos-em-SVG-main/Banco do Estado do Sergipe/logo banese.svg',
  '004': '/Bancos-em-SVG-main/Banco do Nordeste do Brasil S.A/Logo_BNB.svg',
  '604': '/Bancos-em-SVG-main/Banco Industrial do Brasil S.A/BIB-logo-fundo.svg',
  '403': '/Bancos-em-SVG-main/Cora Sociedade Credito Direto S.A/icone-cora-rosa-2500px.svg',
  '097': '/Bancos-em-SVG-main/Credisis/credisis.svg',
  '133': '/Bancos-em-SVG-main/Cresol/Icone-original.svg',
  '136': '/Bancos-em-SVG-main/Unicred/unicred-centralizada.svg',
  '099': '/Bancos-em-SVG-main/Uniprime/uniprime.svg',
  '273': '/Bancos-em-SVG-main/Sulcredi/marca.svg',
  '246': '/Bancos-em-SVG-main/ABC Brasil/logoabc.svg',
  '085': '/Bancos-em-SVG-main/Ailos/logo-ailos.svg',
  '461': '/Bancos-em-SVG-main/Asaas IP S.A/header-logo-azul.svg',
  '213': '/Bancos-em-SVG-main/Banco Arbi/Banco_Arbi .svg',
  '218': '/Bancos-em-SVG-main/Banco BS2 S.A/Banco_BS2.svg',
  '396': '/Bancos-em-SVG-main/MagaluPay/logo-magalupay.svg',
  '630': '/Bancos-em-SVG-main/Lets Bank S.A/Logo Letsbank.svg',
  '456': '/Bancos-em-SVG-main/MUFG/mufg-seeklogo.svg',
  '613': '/Bancos-em-SVG-main/Omni/logo-omni.svg',
  '529': '/Bancos-em-SVG-main/PinBank/pinBank.svg',
  '084': '/Bancos-em-SVG-main/Sisprime/logo.svg',
  '692': '/Bancos-em-SVG-main/Squid Soluções Financeiras/logo.svg',
  '082': '/Bancos-em-SVG-main/Banco Topazio/logo-banco-topazio.svg',
  '265': '/Bancos-em-SVG-main/Efí - Gerencianet/logo-efi-bank-laranja.svg',
};

const IMAGEM_GENERICA_BANCO = '/Bancos-em-SVG-main/banco-generico.svg';

export const getBancoImagem = (codigoCompe: string | null | undefined): string | null => {
  if (!codigoCompe) return IMAGEM_GENERICA_BANCO;
  const codigo = codigoCompe.padStart(3, '0');
  return BANCOS_IMAGENS_MAP[codigo] || IMAGEM_GENERICA_BANCO;
};

