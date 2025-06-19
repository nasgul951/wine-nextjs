import React from 'react';
import { Card, CardContent, Typography, Alert, Grid, Item, Container, TextField, IconButton, CardActionArea } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { useWineService } from '../../../../../hooks/useWineService';
import { Wine } from '../../../../../types/wine';
import WineBottles from './wineBottles';

const WineDetail = ({ wineId }: { wineId: string }) => {
  const wineService = useWineService();
  const [wine, setWine] = React.useState<Wine | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  const initialValueRef = React.useRef<string>('');
  const isDirty = React.useMemo(() => {
    return initialValueRef.current !== JSON.stringify(wine);
  }, [wine]);

  React.useEffect(() => {
    const fetchWine = async () => {
      try {
        const response = await wineService.getWineById(Number(wineId));
        setWine(response.data);
        initialValueRef.current = JSON.stringify(response.data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unknown error');
      }
      setLoading(false);
    };
    fetchWine();
  }, [wineId, wineService]);

  const saveWine = async () => {
    if (!wine) return;
    try {
      const response = await wineService.patchWine(wine.id, {
        vineyard: wine.vineyard,
        label: wine.label,
        varietal: wine.varietal,
        vintage: wine.vintage,
        notes: wine.notes,
      });
      setWine(response.data);
      initialValueRef.current = JSON.stringify(response.data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save wine');
    }
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(`Field changed: ${name} = ${value}`);
    setWine((prevWine) => {
      if (!prevWine) return null;
      return {
        ...prevWine,
        [name]: value,
      };
    });
  };  

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!wine) {
    return <div>No wine found.</div>;
  }

  return (
    <>
      {error && (
        <Alert severity="error" variant="filled" style={{ marginBottom: '20px' }}>
          <strong>Error:</strong> {error}
        </Alert>
      )}
      <Card 
        className="w-3xl"
      >
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{xs: 12, md: 6}}>
              <TextField
                name="vineyard"
                label="Vineyard"
                value={wine.vineyard}
                onChange={handleFieldChange}
                fullWidth
              />
            </Grid>
            <Grid size={{xs: 12, md: 6}}>
              <TextField
                name="label"
                label="Label"
                value={wine.label}
                onChange={handleFieldChange}
                fullWidth
              />
            </Grid>
            <Grid size={{xs: 12, md: 6}}>
              <TextField
                name="varietal"
                label="Varietal"
                value={wine.varietal}
                onChange={handleFieldChange}
                fullWidth
              />
            </Grid>
            <Grid size={{xs: 12, md: 6}}>
              <TextField
                name="vintage"
                label="Vintage"
                value={wine.vintage}
                onChange={handleFieldChange}
                fullWidth
              />
            </Grid>
            <Grid size={12}>
              <TextField
                name="notes"
                label="Notes"
                value={wine.notes}
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
        <WineBottles wineId={wine.id} />
      </Card>
    </>
  );
}

export default WineDetail;