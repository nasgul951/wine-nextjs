import React from 'react';
import { Grid, IconButton, TextField } from '@mui/material';
import { Bottle } from '../../../../../types/wine';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import { useWineService } from '../../../../../hooks/useWineService';
import { set, z } from 'zod';

interface BottleRowProps {
  wineId: number;
  storageId: number;
  binX: number | null;
  binY: number | null;
  depth: number | null;
}

type FieldErrors = {
  binX: string;
  binY: string;
  depth: string;
};

const buildBottleRowProps = (bottle: Bottle | undefined): BottleRowProps => {
  return {
    wineId: bottle?.wineId ?? 0,
    storageId: bottle?.storageId ?? 0,
    binX: bottle?.binX ?? null,
    binY: bottle?.binY ?? null,
    depth: bottle?.depth ?? null,
  };
}

const formSchema = z.object({
  binX: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val), 'must be a valid number')
    .refine((val) => val >= 0, 'Position must be greater than 0'),
  binY: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val), 'Must be a valid number'),
  depth: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val), 'must be a valid number')
    .refine((val) => val >= 0, 'Depth must be greater than 0'),
});

const WineBottleRow = ({
  bottle,
  isNew = false,
  wineId,
  storageId,
  onUpdate,
  onInsert,
  onConsumed,
  onError
}: {
  bottle?: Bottle
  isNew?: boolean;
  wineId?: number;
  storageId?: number;
  onUpdate?: (bottle: Bottle) => void;
  onInsert?: (bottle: Bottle) => void;
  onConsumed?: (bottleId: number) => void;
  onError?: (error: string) => void;
})=> {
  const wineService = useWineService();
  const [data, setData] = React.useState<BottleRowProps>(buildBottleRowProps(bottle));
  const [fieldErrors, setFieldErrors] = React.useState<FieldErrors>({binX: '', binY: '', depth: ''});
  const isDirty = React.useMemo<boolean>(() => {
    return JSON.stringify(buildBottleRowProps(bottle)) !== JSON.stringify(data);
  }, [data, bottle]);

  React.useEffect(() => {
    if (!bottle)
      return;
    setData(buildBottleRowProps(bottle));
  }, [bottle]);

  const saveBottle = async () => {
    if (!validateForm()) 
      return;

    try {
      if (isNew) {
        if (!wineId || !storageId || !data.binX || !data.binY || !data.depth) {
          throw new Error('Wine ID and Storage ID are required for a new bottle');
        }
        const response = await wineService.addBottle({
          wineId: wineId!,
          storageId: storageId!,
          binX: data.binX as number,
          binY: data.binY as number,
          depth: data.depth as number,
        });
        if (onInsert)
          onInsert(response.data as Bottle);
      } else {
        const b = bottle as Bottle;
        const response = await wineService.patchBottle(b.id, {
          binX: data.binX as number,
          binY: data.binY as number,
          depth: data.depth as number,
        });
        if (onUpdate)
          onUpdate(response.data as Bottle);
      }
    } catch (error) {
      if (onError)
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
      if (onConsumed) 
        onConsumed(b.id)
    } catch (error) {
      if (onError)
        onError(error instanceof Error ? `Error: ${error.message}` : 'Failed to consume bottle');
    }
  };

  const handelFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    try {
      formSchema.shape[name as keyof FieldErrors].parse(value);
      setFieldErrors({...fieldErrors, [name]: '' }); // Clear error for the field
    } catch (error) {
      if (error instanceof z.ZodError) {
        setFieldErrors({...fieldErrors, [name]: error.errors[0].message})
      }
    }
  };  

  const validateForm = () => {
    try {
      formSchema.parse(data);
      setFieldErrors({ binX: '', binY: '', depth: '' }); // Clear all errors if validation passes
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.flatten().fieldErrors;
        setFieldErrors({
          binX: errors.binX?.[0] || '',
          binY: errors.binY?.[0] || '',
          depth: errors.depth?.[0] || '',
        });
      }
      return false;
    }
  };

  return (
    <>
      <Grid size={3}>
        <TextField
          name="binY"
          label="Row"
          value={data.binY}
          error={!!fieldErrors.binY}
          helperText={fieldErrors.binY}
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
          error={!!fieldErrors.binX}
          helperText={fieldErrors.binX}
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
          error={!!fieldErrors.depth}
          helperText={fieldErrors.depth}
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
        {!isNew && (
          <IconButton 
            aria-label="delete" 
            color="error"
            onClick={() => consumeBottle()}
          >
            <DeleteIcon />
          </IconButton>
        )}
      </Grid>
    </>
  );
}

export default WineBottleRow;