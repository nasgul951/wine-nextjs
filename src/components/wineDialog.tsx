import { use, useCallback, useEffect, useState } from 'react';
import type { Wine, Bottle } from '../types/wine';
import { useWineService } from '../hooks/service';
import {
  Alert,
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';

const WineDetailDialog = ({isOpen, wine, onClose}: {isOpen: boolean, wine?: Wine, onClose: () => void}) => {
  const [bottles, setBottles] = useState<Bottle[]>([]);
  const [error, setError] = useState<string | null>(null);
  const wineService = useWineService();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchBottles = useCallback(async () => {
    if (wine && wine.id) {
      try {
        const response = await wineService.getBottlesByWineId(wine.id);
        if (!response.success) {
          throw new Error(`Failed to fetch bottles: ${response.status}`);
        }
        setBottles(response.data!);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unknown error');
      }
    }
  }, [wine, wineService]);

  const handleDeleteBottle = async (bottleId: number) => {
    try {
      await wineService.patchBottle(bottleId, { consumed: true });
      setBottles((prevBottles) => prevBottles.filter(bottle => bottle.id !== bottleId));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete bottle');
    }
  };

  useEffect(() => {
    if (isOpen) {
      setError(null);
    }
  }, [isOpen]);

  useEffect(() => {
    fetchBottles();
  }, [fetchBottles]);

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
    >
      <DialogTitle
        sx={{
          backgroundColor: 'primary.main',
          color: 'primary.contrastText',
        }}
      >
        <div>
          {wine?.vineyard}
        </div>
        <div className="text-sm">
          {`${wine?.label} - ${wine?.varietal} (${wine?.vintage})`}
        </div>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ 
            position: 'absolute', 
            right: 8, 
            top: 8, 
            color: 'inherit'
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent
        sx={{
          backgroundColor: 'background.default',
        }}
      >
        {error && (
          <Alert severity="error">
            {error}
          </Alert>
        )}
        <List>
          {bottles.map((bottle) => (
            <Paper 
              key={bottle.id}
              elevation={1}
              sx={{
                mb: 2,
                overflow: 'hidden',
                borderRadius: 1
              }}
            >
              <ListItem 
                key={bottle.id}
                secondaryAction={
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteBottle(bottle.id)}>
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={(
                    <div className="flex justify-between">
                      <div>{bottle.storageDescription || 'No storage description'}</div>
                      <div className="text-xs">
                        Added: {`${bottle.createdDate.getDate() + 1}/${bottle.createdDate.getFullYear()} `}
                      </div>
                    </div>
                  )}
                  secondary={`Row: ${bottle.binY} - Column: ${bottle.binX} - Depth: ${bottle.depth}`}
                />
              </ListItem>
            </Paper>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  )
}

export default WineDetailDialog;