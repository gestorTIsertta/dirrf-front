import { Box, Container } from '@mui/material';
import { useDeclaracao } from 'src/hooks/use-declaracao';
import { useModals } from 'src/hooks/use-modals';
import { DeclaracaoHeader } from 'src/components/declaracao/declaracao-header';
import { ResumoCards } from 'src/components/declaracao/resumo-cards';
import { CategoriasGrid } from 'src/components/declaracao/categorias-grid';
import { DocumentosList } from 'src/components/declaracao/documentos-list';
import { ItensTable } from 'src/components/declaracao/itens-table';
import { ChecklistSection } from 'src/components/declaracao/checklist-section';
import { TimelineSection } from 'src/components/declaracao/timeline-section';
import { ModalCompraVenda } from 'src/components/declaracao/modal-compra-venda';
import { ModalComprovante } from 'src/components/declaracao/modal-comprovante';
import { COLORS } from 'src/constants/declaracao';

export default function DeclaracaoView() {
  const {
    comprasVendas,
    formData,
    comprovanteData,
    setFormData,
    setComprovanteData,
    addCompraVenda,
    updateComprovante,
    resetFormData,
    resetComprovanteData,
  } = useDeclaracao();

  const {
    modalCompraVendaOpen,
    modalComprovanteOpen,
    operacaoAtual,
    categoriaAtual,
    openCompraVenda,
    closeCompraVenda,
    openComprovante,
    closeComprovante,
  } = useModals();

  const handleOpenCompraVenda = (operacao: 'Compra' | 'Venda', categoria: string) => {
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

  const handleSubmitComprovante = (compraVendaId: string, arquivo: File) => {
    updateComprovante(compraVendaId, arquivo);
    handleCloseComprovante();
  };

  return (
    <Box sx={{ bgcolor: COLORS.grey100, minHeight: '100vh', py: { xs: 2, sm: 3 } }}>
      <Container maxWidth="lg" sx={{ px: { xs: 1.5, sm: 2, md: 3 } }}>
        <DeclaracaoHeader />

        <ResumoCards />

        <CategoriasGrid
          onCompraClick={(categoria) => handleOpenCompraVenda('Compra', categoria)}
          onVendaClick={(categoria) => handleOpenCompraVenda('Venda', categoria)}
        />

        <DocumentosList onAnexarClick={handleOpenComprovante} />

        <ItensTable />

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
        />

        <ModalComprovante
          open={modalComprovanteOpen} 
          onClose={handleCloseComprovante}
          onSubmit={handleSubmitComprovante}
          comprasVendas={comprasVendas}
          comprovanteData={comprovanteData}
          onComprovanteDataChange={setComprovanteData}
        />
      </Container>
    </Box>
  );
}
