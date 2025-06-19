import { Grid, IconButton, TextField } from '@mui/material';
import { Bottle, NewBottleRequest } from '../../../../../types/wine';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import { useWineService } from '../../../../../hooks/useWineService';
import React from 'react';
import { init } from 'next/dist/compiled/webpack/webpack';

interface BottleRowProps {
  binX: number;
  binY: number;
  depth: number;
}

const WineBottleRow = ({
  bottle,
  isNew = false,
  onUpdate,
  onConsumed,
  onError
}: {
  bottle: Bottle | NewBottleRequest
  isNew: boolean;
  onUpdate: (bottle: Bottle) => void;
  onConsumed: (bottleId: number) => void;
  onError: (error: string) => void;
})=> {
  const wineService = useWineService();
  const [data, setData] = React.useState<BottleRowProps>(bottle);
  const isDirty = React.useMemo<boolean>(() => {
    return bottle && JSON.stringify(data) !== JSON.stringify({
      binX: bottle.binX,
      binY: bottle.binY,
      depth: bottle.depth,
    });
  }, [data, bottle]);

  React.useEffect(() => {
    setData({
      binX: bottle.binX,
      binY: bottle.binY,
      depth: bottle.depth,
    });
  }, [bottle]);

  const saveBottle = async () => {
    try {
      if (isNew) {
        //TODO: Handle saving a new bottle
      } else {
        const b = bottle as Bottle;
        const response = await wineService.patchBottle(b.id, {
          binX: data.binX,
          binY: data.binY,
          depth: data.depth,
        });
        onUpdate(response.data as Bottle);
      }
    } catch (error) {
      onError(error instanceof Error ? `Error: ${error.message}` : 'Failed to save bottle');
    }
  };

  const consumeBottle = async () => {
    try {
      if (isNew) {
        throw new Error('Cannot consume a new bottle that has not been saved yet');
      }
      const b = bottle as Bottle;
      await wineService.patchBottle(b.id, { consumed: true });
      onConsumed(b.id)
    } catch (error) {
      onError(error instanceof Error ? `Error: ${error.message}` : 'Failed to consume bottle');
    }
  };

  const handelFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };  

  return (
    <>
      <Grid size={3}>
        <TextField
          name="binY"
          label="Row"
          value={data.binY}
          onChange={handelFieldChange}
          size="small"
          fullWidth
        />
      </Grid>
      <Grid size={3}>
        <TextField
          name="binX"
          label="Position"
          value={data.binX}
          onChange={handelFieldChange}
          size="small"
          fullWidth
        />
      </Grid>
      <Grid size={3}>
        <TextField
          name="depth"
          label="Depth"
          value={data.depth}
          onChange={handelFieldChange}
          size="small"
          fullWidth
        />
      </Grid>
      <Grid size={3} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {isDirty && (
          <IconButton 
            aria-label="save" 
            color="primary"
            onClick={() => saveBottle()}
          >
            <SaveIcon />
          </IconButton>
        )}
        <IconButton 
          aria-label="delete" 
          color="error"
          onClick={() => consumeBottle()}
        >
          <DeleteIcon />
        </IconButton>
      </Grid>
    </>
  );
}

export default WineBottleRow;