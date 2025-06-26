import * as React from 'react';
import { useWineService } from '../../../hooks/service'
import type { Varietal } from '../../../types';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Item from '@mui/material/ListItem';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Link from '@mui/material/Link';

const VarietalList = ({ varietals }: { varietals: Varietal[] }) => {
  return (
    <Grid 
      container spacing={{ xs: 2, md: 3 }} 
      sx={{
        justifyContent: 'space-around',
        alignItems: 'stretch',
      }}
    >
      {varietals.map((varietal) => (
        <Grid key={varietal.name} size={{ xs: 12, md: 6 }}>
          <Item>
            <Card sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardActionArea component={Link} href={`/varietals/${varietal.name}`}>
                <CardContent>
                  <Typography variant="h6">{varietal.name}</Typography>
                  <Typography color="text.secondary">Count: {varietal.count}</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Item>
        </Grid>
      ))}
    </Grid>    
  );
}

export default function VarietalPage() {
  const [varietals, setVarietals] = React.useState<Varietal[]>([]);
  const [error, setError] = React.useState<string | undefined>(undefined);
  const wineService = useWineService();

  React.useEffect(() => {
    const fetchVarietals = async () => {
      try {
        const response = await wineService.getVarietals();
        if (!response.success) {
          throw new Error(`Failed to fetch varietals: ${response.status}`);
        }
        setVarietals(response.data!);
      } catch (error) {
        const msg = error instanceof Error ? error.message : 'Unknown error';
        setError(`Faild to fetch variatles: ${msg}`);
      }
    };

    fetchVarietals();
  }, [wineService]);

  return (
    <div>
      <VarietalList varietals={varietals} />
    </div>
  );
}
