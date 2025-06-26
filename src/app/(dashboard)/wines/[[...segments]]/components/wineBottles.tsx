import React from 'react';
import { CardContent, Typography, Grid, IconButton } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { useWineService } from '../../../../../hooks/service';
import { Bottle } from '../../../../../types/wine';
import WineBottleRow from './wineBottleRow';
import AlertBox from '../../../../../components/alertBox';


const storageId = 5; // TODO: Support alternate storage locations in the future

const WineBottles = ({ wineId }: { wineId: number }) => {
  const wineService = useWineService();
  const [bottles, setBottles] = React.useState<Bottle[]>([]);
  const [addNewBottle, setAddNewBottle] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchWine = async () => {
      try {
        const bottlesResponse = await wineService.getBottlesByWineId(Number(wineId));
        setBottles(bottlesResponse.data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unknown error');
      }
      setLoading(false);
    };
    fetchWine();
  }, [wineId, wineService]);

  const handleOnBottleUpdate = (updatedBottle: Bottle) => {
    setBottles((prevBottles) =>
      prevBottles.map((b) => (b.id === updatedBottle.id ? updatedBottle : b))
    );
  };

  const handleOnBottleConsumed = (bottleId: number) => {
    setBottles((prevBottles) => prevBottles.filter((b) => b.id !== bottleId));
  };

  const handleOnBottleInsert = (newBottle: Bottle) => {
    setBottles((prevBottles) => [...prevBottles, newBottle]);
    setAddNewBottle(false);
  }

  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <Typography variant="h6" gutterBottom>
            Bottles
          </Typography>
          <IconButton 
            aria-label="add" 
            color="primary"
            onClick={() => {setAddNewBottle(true)}}
          >
            <AddIcon />
          </IconButton>
        </div>
        <AlertBox type="error" message={error} onClear={() => setError(null)} />
        <Grid container spacing={2}>
          {bottles.map((bottle) => (
            <WineBottleRow
              key={bottle.id}
              bottle={bottle}
              isNew={false}
              onUpdate={handleOnBottleUpdate}
              onConsumed={handleOnBottleConsumed}
              onError={(errorMessage) => setError(errorMessage)}
            />
          ))}
          {addNewBottle && (
            <WineBottleRow
              isNew={true}
              wineId={wineId}
              storageId={storageId}
              onInsert={handleOnBottleInsert}
              onError={(errorMessage) => setError(errorMessage)}
            />
          )}
        </Grid>
        <div>{addNewBottle}</div>
      </CardContent>
    </>
  );
}

export default WineBottles;