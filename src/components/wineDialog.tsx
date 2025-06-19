import { useCallback, useEffect, useState } from 'react';
import type { Wine, Bottle } from '../types/wine';
import { useWineService } from '../hooks/useWineService';
import {
  Alert,
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';

const WineDetailDialog = ({isOpen, wine, onClose}: {isOpen: boolean, wine?: Wine, onClose: () => void}) => {
  const [bottles, setBottles] = useState<Bottle[]>([]);
  const [error, setError] = useState<string | null>(null);
  const wineService = useWineService();

  const fetchBottles = useCallback(async () => {
    if (wine && wine.id) {
      try {
        const response = await wineService.getBottlesByWineId(wine.id);
        setBottles(response.data);
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
    fetchBottles();
  }, [fetchBottles]);

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <Card>
        <CardHeader
          title={wine?.vineyard}
          subheader={
            <>
              <div>
                {`${wine?.label} - ${wine?.varietal} (${wine?.vintage})`}
              </div>
              <Typography variant="caption" color="text.secondary">
                {wine?.notes || 'No description available.'}
              </Typography>
              <Divider />
            </>
          }
          action={
            <Avatar onClick={onClose} sx={{ cursor: 'pointer' }}>
              X
            </Avatar>
          }
        />
        <CardContent>
          {error && (
            <Alert severity="error">
              {error}
            </Alert>
          )}
          <List>
            {bottles.map((bottle) => (
              <ListItem 
                key={bottle.id}
                secondaryAction={
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteBottle(bottle.id)}>
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={bottle.storageDescription || 'No storage description'}
                  secondary={`Row: ${bottle.binX} - Column: ${bottle.binY} - Depth: ${bottle.depth}`}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Dialog>
  )
}

export default WineDetailDialog;