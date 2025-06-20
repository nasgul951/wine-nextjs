import React from 'react';
import { Card, CardContent, Typography, Alert, Grid, Item, Container, TextField, IconButton, CardActionArea } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { useWineService } from '../../../../../hooks/useWineService';
import { Wine } from '../../../../../types/wine';
import WineBottles from './wineBottles';
import AlertBox from '../../../../../components/alertBox';
import { z } from 'zod';

const formSchema = z.object({
  vintage: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val), 'Not a valid year')
    .refine((val) => val >= 1900, 'Not a valid year')
    .refine((val) => val <= new Date().getFullYear(), 'Not a valid year'),
  vineyard: z
    .string()
    .min(1, 'Vineyard name is required')
    .max(50, 'Vineyard name cannot exceed 50 characters'),
  label: z
    .string()
    .max(50, 'Vineyard name cannot exceed 50 characters'),
  varietal: z
    .string()
    .min(1, 'Varietal is required')
    .max(30, 'Vineyard name cannot exceed 50 characters'),
  notes: z
    .string()
});

type FieldErrors = {
  vineyard: string;
  label: string;
  varietal: string;
  vintage: string;
  notes: string;
};
const initialFieldErrors: FieldErrors = {
  vineyard: '',
  label: '',
  varietal: '',
  vintage: '',
  notes: '',
};

interface IWineDetailProps {
  vineyard: string;
  label: string;
  varietal: string;
  vintage: number | null;
  notes: string;
}

const toWineDetailProps = (wine: Wine | null): IWineDetailProps => {
  return {
    vineyard: wine?.vineyard ?? '',
    label: wine?.label ?? '',
    varietal: wine?.varietal ?? '',
    vintage: wine?.vintage ?? null,
    notes: wine?.notes ?? '',
  };
}

const WineDetail = ({ 
  wineId,
  onInsert
}: { 
  wineId?: number | null 
  onInsert?: (wineId: number) => void
}) => {
  const wineService = useWineService();
  const [data, setData] = React.useState<IWineDetailProps>(toWineDetailProps(null));
  const [fieldErrors, setFieldErrors] = React.useState<FieldErrors>(initialFieldErrors);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  const initialValueRef = React.useRef<string>(JSON.stringify(data));
  const isDirty = React.useMemo(() => {
    return initialValueRef.current !== JSON.stringify(data);
  }, [data]);

  React.useEffect(() => {
    if (!wineId) {
      setLoading(false);
      return;
    }

    const fetchWine = async () => {
      try {
        const response = await wineService.getWineById(Number(wineId));
        const data = toWineDetailProps(response.data)
        setData(data);
        initialValueRef.current = JSON.stringify(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unknown error');
      }
      setLoading(false);
    };
    fetchWine();
  }, [wineId, wineService]);

  const saveWine = async () => {
    if (!validateForm) return;
    try {
      let response = null;
      if (wineId) {
        response = await wineService.patchWine(wineId, {
          vineyard: data.vineyard,
          label: data.label,
          varietal: data.varietal,
          vintage: data.vintage!,
          notes: data.notes,
        });
      } else {
        response = await wineService.addWine({
          vineyard: data.vineyard,
          label: data.label,
          varietal: data.varietal,
          vintage: data.vintage!,
          notes: data.notes,
        });
        if (onInsert) {
          onInsert(response.data.id);
        }
      }

      const newData = toWineDetailProps(response.data);
      setData(newData);
      initialValueRef.current = JSON.stringify(newData);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save wine');
    }
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(`Field changed: ${name} = ${value}`);
    setData((prevData) => {
      return {
        ...prevData,
        [name]: value,
      };
    });

    try {
      formSchema.shape[name as keyof FieldErrors].parse(value);
      setFieldErrors({...fieldErrors, [name]: '' }); // Clear error for the field
    } catch (error) {
      if (error instanceof z.ZodError) {
        setFieldErrors({...fieldErrors, [name]: error.errors[0].message})
      }
    }
  };  

  if (loading) {
    return <div>Loading...</div>;
  }

  const validateForm = () => {
    try {
      formSchema.parse(data);
      setFieldErrors({ binX: '', binY: '', depth: '' }); // Clear all errors if validation passes
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.flatten().fieldErrors;
        setFieldErrors({
          vineyard: errors.vineyard?.[0] || '',
          label: errors.label?.[0] || '',
          varietal: errors.varietal?.[0] || '',
          vintage: errors.vintage?.[0] || '',
          notes: errors.notes?.[0] || '',
        });
      }
      return false;
    }
  };

  return (
    <>
      <AlertBox type="error" message={error} onClear={() => setError(null)} />
      <Card 
        className="w-3xl"
      >
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{xs: 12, md: 6}}>
              <TextField
                name="vineyard"
                label="Vineyard"
                value={data.vineyard}
                onChange={handleFieldChange}
                fullWidth
              />
            </Grid>
            <Grid size={{xs: 12, md: 6}}>
              <TextField
                name="label"
                label="Label"
                value={data.label}
                onChange={handleFieldChange}
                fullWidth
              />
            </Grid>
            <Grid size={{xs: 12, md: 6}}>
              <TextField
                name="varietal"
                label="Varietal"
                value={data.varietal}
                onChange={handleFieldChange}
                fullWidth
              />
            </Grid>
            <Grid size={{xs: 12, md: 6}}>
              <TextField
                name="vintage"
                label="Vintage"
                value={data.vintage}
                onChange={handleFieldChange}
                fullWidth
              />
            </Grid>
            <Grid size={12}>
              <TextField
                name="notes"
                label="Notes"
                value={data.notes}
                onChange={handleFieldChange}
                multiline
                rows={2}
                fullWidth
              />
            </Grid>  
          </Grid>
        </CardContent>
        <CardActionArea>
          {isDirty && (
            <Alert severity="warning"
              variant="filled"
              action={
                <IconButton 
                  aria-label="save" 
                  color="primary"
                  onClick={saveWine}
                >
                  <SaveIcon />
                </IconButton>
              }
            >
              <Typography>
                Unsaved Changes
              </Typography>
            </Alert>
          )}
        </CardActionArea>
        {wineId && (
          <WineBottles wineId={wineId} />
        )}
      </Card>
    </>
  );
}

export default WineDetail;