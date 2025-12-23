import { useState, useRef, useCallback, useEffect } from 'react';
import { Box, Container } from '@mui/material';
import { useDeclaracao } from 'src/hooks/use-declaracao';
import { useModals } from 'src/hooks/use-modals';
import { useDeclaracaoYear } from 'src/hooks/use-declaracao-year';
import { useTransactions } from 'src/hooks/use-transactions';
import { DeclaracaoHeader } from 'src/components/declaracao/declaracao-header';
import { ResumoCards } from 'src/components/declaracao/resumo-cards';
import { CategoriasGrid } from 'src/components/declaracao/categorias-grid';
import { DocumentosList } from 'src/components/declaracao/documentos-list';
import { ItensTable } from 'src/components/declaracao/itens-table';
import { BancosTable } from 'src/components/declaracao/bancos-table';
import { DependentesTable } from 'src/components/declaracao/dependentes-table';
import { ServicosTomadosTable } from 'src/components/declaracao/servicos-tomados-table';
import { ChecklistSection } from 'src/components/declaracao/checklist-section';
import { TimelineSection } from 'src/components/declaracao/timeline-section';
import { ModalCompraVenda } from 'src/components/declaracao/modal-compra-venda';
import { ModalComprovante } from 'src/components/declaracao/modal-comprovante';
import { ModalEmprestimo } from 'src/components/declaracao/modal-emprestimo';
import { ModalParticipacao } from 'src/components/declaracao/modal-participacao';
import { ModalAtividadeRural } from 'src/components/declaracao/modal-atividade-rural';
import { COLORS } from 'src/constants/declaracao';
import { Banco, CompraVenda } from 'src/types/declaracao';

export default function DeclaracaoView() {
  const { year, setYear } = useDeclaracaoYear();
  const [bancos, setBancos] = useState<Banco[]>([]);
  const itensTableRef = useRef<{ reload: () => void } | null>(null);
  const documentosListRef = useRef<{ reload: () => void } | null>(null);

  const {
    submitCompraVenda,
    submitComprovante,
    submitEmprestimo,
    submitParticipacao,
    submitAtividadeRural,
    updateRefs,
  } = useTransactions({ year });

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

  useEffect(() => {
    updateRefs(itensTableRef.current, documentosListRef.current);
  }, [updateRefs]);

  const handleOpenCompraVenda = useCallback((operacao: 'Compra' | 'Venda', categoria: string) => {
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
  }, [resetEmprestimoData, openEmprestimo, resetParticipacaoData, openParticipacao, resetAtividadeRuralData, openAtividadeRural, resetFormData, openCompraVenda]);

  const handleCloseCompraVenda = useCallback(() => {
    closeCompraVenda();
    resetFormData();
  }, [closeCompraVenda, resetFormData]);

  const handleSubmitCompraVenda = useCallback(async (compraVenda: CompraVenda) => {
    await submitCompraVenda(compraVenda);
    handleCloseCompraVenda();
  }, [submitCompraVenda, handleCloseCompraVenda]);

  const handleOpenComprovante = useCallback(() => {
    resetComprovanteData();
    openComprovante();
  }, [resetComprovanteData, openComprovante]);

  const handleCloseComprovante = useCallback(() => {
    closeComprovante();
    resetComprovanteData();
  }, [closeComprovante, resetComprovanteData]);

  const handleSubmitComprovante = useCallback(async (bancoId: string, arquivo: File) => {
    await submitComprovante(bancoId, arquivo);
    handleCloseComprovante();
  }, [submitComprovante, handleCloseComprovante]);

  const handleSubmitEmprestimo = useCallback(async (data: typeof emprestimoData) => {
    await submitEmprestimo(data);
    closeEmprestimo();
    resetEmprestimoData();
  }, [submitEmprestimo, closeEmprestimo, resetEmprestimoData]);

  const handleSubmitParticipacao = useCallback(async (data: typeof participacaoData) => {
    await submitParticipacao(data);
    closeParticipacao();
    resetParticipacaoData();
  }, [submitParticipacao, closeParticipacao, resetParticipacaoData]);

  const handleSubmitAtividadeRural = useCallback(async (data: typeof atividadeRuralData) => {
    await submitAtividadeRural(data);
    closeAtividadeRural();
    resetAtividadeRuralData();
  }, [submitAtividadeRural, closeAtividadeRural, resetAtividadeRuralData]);

  return (
    <Box sx={{ bgcolor: COLORS.grey100, minHeight: '100vh', py: { xs: 2, sm: 3 } }}>
      <Container maxWidth="lg" sx={{ px: { xs: 1.5, sm: 2, md: 3 } }}>
        <DeclaracaoHeader year={year} onYearChange={setYear} />

        <ResumoCards year={year} />

        <BancosTable year={year} bancos={bancos} onBancosChange={setBancos} />

        <DependentesTable year={year} />

        <ServicosTomadosTable year={year} />

        <DocumentosList ref={documentosListRef} year={year} onAnexarClick={handleOpenComprovante} />

        <CategoriasGrid
          onCompraClick={(categoria) => handleOpenCompraVenda('Compra', categoria)}
          onVendaClick={(categoria) => handleOpenCompraVenda('Venda', categoria)}
        />

        <ItensTable ref={itensTableRef} year={year} bancos={bancos} />

        <ChecklistSection year={year} />

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
