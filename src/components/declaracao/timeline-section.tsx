import { Stack, Typography, Box, Paper } from '@mui/material';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { timelineSteps, COLORS } from 'src/constants/declaracao';

export function TimelineSection() {
  return (
    <Paper sx={{ p: { xs: 2, sm: 3 }, mb: { xs: 2, sm: 3 } }}>
      <Typography variant="h6" fontWeight={700} mb={1} sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
        Linha do tempo do processo
      </Typography>
      <Stack spacing={2}>
        {timelineSteps.map((step, idx) => (
          <Stack
            key={idx}
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 1, sm: 2 }}
            alignItems={{ xs: 'flex-start', sm: 'flex-start' }}
            sx={{ position: 'relative' }}
          >
            <Box mt={{ xs: 0, sm: 0.5 }}>
              {step.done ? (
                <CheckCircleIcon sx={{ color: COLORS.success, fontSize: { xs: 20, sm: 24 } }} />
              ) : (
                <Box
                  sx={{
                    width: { xs: 20, sm: 24 },
                    height: { xs: 20, sm: 24 },
                    borderRadius: '50%',
                    border: `2px solid ${step.current ? COLORS.primary : COLORS.grey200}`,
                    bgcolor: step.current ? COLORS.primary + '20' : '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {step.current && (
                    <Box
                      sx={{
                        width: { xs: 6, sm: 8 },
                        height: { xs: 6, sm: 8 },
                        borderRadius: '50%',
                        bgcolor: COLORS.primary,
                      }}
                    />
                  )}
                </Box>
              )}
            </Box>
            <Box flex={1} sx={{ width: { xs: '100%', sm: 'auto' } }}>
              <Typography fontWeight={step.done || step.current ? 700 : 500} sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                {step.label}
              </Typography>
              <Typography variant="body2" color={COLORS.grey600} sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                {step.desc}
              </Typography>
            </Box>
            <Typography
              variant="caption"
              color={COLORS.grey600}
              sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' }, alignSelf: { xs: 'flex-start', sm: 'center' } }}
            >
              {step.data}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Paper>
  );
}

