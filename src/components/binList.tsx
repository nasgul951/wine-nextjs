import React from 'react';
import { Drawer, List, ListItem, ListItemText, Button, Typography, LinearProgress, IconButton, Paper, AppBar, ListItemAvatar, Avatar } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AlertBox from './alertBox';
import { useWineService } from '../hooks/service';
import { IStoreBottle } from '../types/wine';
import { WineStore, IBin } from '../data/store';

// Props for the component
type BinListProps = {
  open: boolean;
  binId: number | null;
  onClose: () => void;
  onBottleDeleted?: (bottleId: number) => void;
};

const BinList: React.FC<BinListProps> = ({ binId, open, onClose, onBottleDeleted }) => {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [bottles, setBottles] = React.useState<IStoreBottle[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const wineService = useWineService();
  
  const wineStore = React.useMemo(() => new WineStore(5), []);

  const bin = React.useMemo<IBin>(() => {
    if (binId === null) return { x: 0, y: 0 };
    return wineStore.unpackBinId(binId);
  }, [binId, wineStore]);

  // Fetch bottles by binId when the component mounts or binId changes
  React.useEffect(() => {
    if (binId === null) return;
    const fetchBottles = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await wineService.getBottlesByBinId(binId);
        if (!response.success) {
          throw new Error(`Failed to fetch bottles: ${response.status}`);
        }
        response.data!.sort((a, b) => {
          if (a.depth !== b.depth) {
            return a.depth - b.depth;
          }
          return a.binX - b.binX;
        });
        setBottles(response.data!);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchBottles();
  }, [binId, wineService]);

  const handleDeleteBottle = async (bottleId: number) => {
    try {
      const response = await wineService.patchBottle(bottleId, { consumed: true });
      if (!response.success) {
        throw new Error(`Failed to delete bottle: ${response.status}`);
      }
      setBottles(prevBottles => prevBottles.filter(bottle => bottle.bottleId !== bottleId));
      if (onBottleDeleted) {
        onBottleDeleted(bottleId);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete bottle');
    }
  }

  return (
    <>
      <Drawer 
        open={open} 
        anchor="right" 
        onClose={onClose}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100vw', sm: 'auto' },
          },
        }}
      >
        <div className='flex flex-col pt-14 w-full h-full md:w-sm'>
          <AppBar
            position="static"
            className="h-16 pt-2 flex justify-center pl-5"
          >
            <Typography variant="h6" gutterBottom>
              Row {bin.y}, Bin {bin.x}
            </Typography>
          </AppBar>
          <div className="flex-grow h-full">   
            <AlertBox type="error" message={error} onClear={() => setError(null)} />
            {loading ? <LinearProgress /> :
              <List>
                {bottles.length === 0 ? (
                  <ListItem>
                    <ListItemText primary="No bottles found." />
                  </ListItem>
                ) : (
                  bottles.map(bottle => (
                    <ListItem 
                      key={bottle.bottleId}
                      secondaryAction={
                        <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteBottle(bottle.bottleId)}>
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar>{bottle.depth}</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${bottle.vineyard}`}
                        secondary={
                          <div className="flex">
                            <div className="flex-grow">
                              {bottle.label} - {bottle.varietal} ({bottle.vintage})
                            </div>
                            {(bottle.binX !== bin.x) && 
                              <div className="w-2">{bottle.binX}</div>
                            }
                          </div>
                        }
                      />
                    </ListItem>
                  ))
                )}
              </List>
            }
          </div>
          <div className="p-5">
            <Button 
              onClick={onClose} 
              variant="contained" 
              color="primary" 
              fullWidth
              className="mt-auto"
            >
              Close
            </Button>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default BinList;