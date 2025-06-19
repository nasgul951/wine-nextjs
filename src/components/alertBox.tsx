import { Alert } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';

const AlertBox = ({ 
  message, 
  type, 
  onClear }: 
{ 
 message: string | null; 
 type: 'success' | 'error' | 'info' | 'warning';
 onClear: () => void;
}) => {
  return (
    <>
      {message && (
        <Alert 
          severity={type} 
          variant="filled" 
          style={{ marginBottom: '20px' }}
          action={
            <IconButton 
              aria-label="close" 
              color="inherit"
              onClick={onClear}
            >
              <ClearIcon />
            </IconButton>
          }
        >
          {message}
        </Alert>
      )}
    </>
  );
}

export default AlertBox;