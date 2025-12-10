import { useState } from 'react';
import { Box, Container } from '@mui/material';
import { useDeclaracao } from 'src/hooks/use-declaracao';
import { useModals } from 'src/hooks/use-modals';
import { DeclaracaoHeader } from 'src/components/declaracao/declaracao-header';
import { ResumoCards } from 'src/components/declaracao/resumo-cards';
import { CategoriasGrid } from 'src/components/declaracao/categorias-grid';
import { DocumentosList } from 'src/components/declaracao/documentos-list';
import { ItensTable } from 'src/components/declaracao/itens-table';
import { BancosTable } from 'src/components/declaracao/bancos-table';
import { ChecklistSection } from 'src/components/declaracao/checklist-section';
import { TimelineSection } from 'src/components/declaracao/timeline-section';
import { ModalCompraVenda } from 'src/components/declaracao/modal-compra-venda';
import { ModalComprovante } from 'src/components/declaracao/modal-comprovante';
import { ModalEmprestimo } from 'src/components/declaracao/modal-emprestimo';
import { ModalParticipacao } from 'src/components/declaracao/modal-participacao';
import { ModalAtividadeRural } from 'src/components/declaracao/modal-atividade-rural';
import { COLORS } from 'src/constants/declaracao';
import { Banco } from 'src/types/declaracao';

const criarArquivoExemplo = (nome: string, tipo: string = 'application/pdf'): File => {
  const blob = new Blob(['Conteúdo do arquivo de exemplo'], { type: tipo });
  return new File([blob], nome, { type: tipo, lastModified: Date.now() });
};

export default function DeclaracaoView() {
  const [bancos, setBancos] = useState<Banco[]>([
    {
      id: '1',
      nome: 'Banco do Brasil',
      conta: '12345-6',
      agencia: '1234-5',
      tipo: 'Corrente',
      dataAbertura: '15/03/2020',
      informeRendimentos: criarArquivoExemplo('Informe_Rendimentos_BB_2024.pdf'),
    },
    {
      id: '2',
      nome: 'Itaú',
      conta: '78901-2',
      agencia: '5678-9',
      tipo: 'Poupança',
      dataAbertura: '22/05/2019',
    },
  ]);

  const {
    formData,
    comprovanteData,
    emprestimoData,
    participacaoData,
    atividadeRuralData,
    setFormData,
    setComprovanteData,
    setEmprestimoData,
    setParticipacaoData,
    setAtividadeRuralData,
    addCompraVenda,
    resetFormData,
    resetComprovanteData,
    resetEmprestimoData,
    resetParticipacaoData,
    resetAtividadeRuralData,
  } = useDeclaracao();

  const {
    modalCompraVendaOpen,
    modalComprovanteOpen,
    modalEmprestimoOpen,
    modalParticipacaoOpen,
    modalAtividadeRuralOpen,
    operacaoAtual,
    categoriaAtual,
    openCompraVenda,
    closeCompraVenda,
    openComprovante,
    closeComprovante,
    openEmprestimo,
    closeEmprestimo,
    openParticipacao,
    closeParticipacao,
    openAtividadeRural,
    closeAtividadeRural,
  } = useModals();

  const handleOpenCompraVenda = (operacao: 'Compra' | 'Venda', categoria: string) => {
    if (categoria === 'Empréstimos') {
      resetEmprestimoData();
      openEmprestimo();
      return;
    }
    if (categoria === 'Participações em Empresas') {
      resetParticipacaoData();
      openParticipacao();
      return;
    }
    if (categoria === 'Atividade Rural') {
      resetAtividadeRuralData();
      openAtividadeRural();
      return;
    }
    resetFormData();
    openCompraVenda(operacao, categoria);
  };

  const handleCloseCompraVenda = () => {
    closeCompraVenda();
    resetFormData();
  };

  const handleSubmitCompraVenda = (compraVenda: Parameters<typeof addCompraVenda>[0]) => {
    addCompraVenda(compraVenda);
    handleCloseCompraVenda();
  };

  const handleOpenComprovante = () => {
    resetComprovanteData();
    openComprovante();
  };

  const handleCloseComprovante = () => {
    closeComprovante();
    resetComprovanteData();
  };

  const handleSubmitComprovante = (bancoId: string, arquivo: File) => {
    setBancos((prev) =>
      prev.map((b) => (b.id === bancoId ? { ...b, informeRendimentos: arquivo } : b))
    );
    handleCloseComprovante();
  };

  const handleSubmitEmprestimo = (_data: typeof emprestimoData) => {
    closeEmprestimo();
    resetEmprestimoData();
  };

  const handleSubmitParticipacao = (_data: typeof participacaoData) => {
    closeParticipacao();
    resetParticipacaoData();
  };

  const handleSubmitAtividadeRural = (_data: typeof atividadeRuralData) => {
    closeAtividadeRural();
    resetAtividadeRuralData();
  };

  return (
    <Box sx={{ bgcolor: COLORS.grey100, minHeight: '100vh', py: { xs: 2, sm: 3 } }}>
      <Container maxWidth="lg" sx={{ px: { xs: 1.5, sm: 2, md: 3 } }}>
        <DeclaracaoHeader />

        <ResumoCards />

        <BancosTable bancos={bancos} onBancosChange={setBancos} />

        <DocumentosList onAnexarClick={handleOpenComprovante} />

        <CategoriasGrid
          onCompraClick={(categoria) => handleOpenCompraVenda('Compra', categoria)}
          onVendaClick={(categoria) => handleOpenCompraVenda('Venda', categoria)}
        />

        <ItensTable bancos={bancos} />

        <ChecklistSection />

        <TimelineSection />

        <ModalCompraVenda
          open={modalCompraVendaOpen}
          onClose={handleCloseCompraVenda}
          onSubmit={handleSubmitCompraVenda}
          operacao={operacaoAtual}
          categoria={categoriaAtual}
          formData={formData}
          onFormDataChange={setFormData}
          bancos={bancos}
        />

        <ModalComprovante
          open={modalComprovanteOpen}
          onClose={handleCloseComprovante}
          onSubmit={handleSubmitComprovante}
          bancos={bancos}
          comprovanteData={comprovanteData}
          onComprovanteDataChange={setComprovanteData}
        />

        <ModalEmprestimo
          open={modalEmprestimoOpen}
          onClose={closeEmprestimo}
          onSubmit={handleSubmitEmprestimo}
          formData={emprestimoData}
          onFormDataChange={setEmprestimoData}
          bancos={bancos}
        />

        <ModalParticipacao
          open={modalParticipacaoOpen}
          onClose={closeParticipacao}
          onSubmit={handleSubmitParticipacao}
          formData={participacaoData}
          onFormDataChange={setParticipacaoData}
        />

        <ModalAtividadeRural
          open={modalAtividadeRuralOpen}
          onClose={closeAtividadeRural}
          onSubmit={handleSubmitAtividadeRural}
          formData={atividadeRuralData}
          onFormDataChange={setAtividadeRuralData}
          bancos={bancos}
        />
      </Container>
    </Box>
  );
}
