import React from 'react';
import { Grid } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';
import { SummaryCard } from './summary-card';

export interface SummaryCardData {
  label: string;
  valor: number;
  diff: string;
  cor: string;
  icon: SvgIconComponent;
  iconColor: string;
  highlightDiff?: boolean;
}

interface SummaryCardsGridProps {
  cards: SummaryCardData[];
}

export function SummaryCardsGrid({ cards }: SummaryCardsGridProps) {
  return (
    <Grid container spacing={{ xs: 2, sm: 2, md: 2 }} sx={{ mb: 3 }}>
      {cards.map((card) => (
        <Grid item xs={12} sm={6} md={6} lg={2.4} key={card.label}>
          <SummaryCard
            label={card.label}
            value={card.valor}
            diff={card.diff}
            backgroundColor={card.cor}
            icon={card.icon}
            iconColor={card.iconColor}
            highlightDiff={card.highlightDiff || card.label === 'Total de declarações'}
          />
        </Grid>
      ))}
    </Grid>
  );
}

