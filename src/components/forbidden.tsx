'use client';
import { Box, Typography, Button } from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';
import { useRouter } from 'next/navigation';

interface ForbiddenProps {
  message?: string;
  showHomeButton?: boolean;
}

const Forbidden = ({
  message = 'You do not have permission to access this page.',
  showHomeButton = true
}: ForbiddenProps) => {
  const router = useRouter();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="50vh"
      textAlign="center"
      gap={2}
    >
      <BlockIcon sx={{ fontSize: 80, color: 'error.main' }} />
      <Typography variant="h4" component="h1" gutterBottom>
        403 - Forbidden
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {message}
      </Typography>
      {showHomeButton && (
        <Button
          variant="contained"
          onClick={() => router.push('/')}
          sx={{ mt: 2 }}
        >
          Go to Dashboard
        </Button>
      )}
    </Box>
  );
};

export default Forbidden;
