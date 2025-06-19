import * as React from 'react';
import { WineService } from '../../service/wineService'
import type { Varietal } from '../../types';
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
      columns={{ xs: 4, sm: 8, md: 12 }}
      sx={{
        justifyContent: 'space-around',
        alignItems: 'stretch',
      }}
    >
      {varietals.map((varietal) => (
        <Grid key={varietal.name} size={{ xs: 2, sm: 4, md: 4 }}>
          <Item>
            <Card sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardActionArea component={Link} href={`/wine/${varietal.name}`}>
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

export default async function HomePage() {
  const wineService = new WineService();
  let varietals: Varietal[] = [];
  try {
    const response = await wineService.getVarietals();
    varietals = response.data;
  } catch (error) {
    return (
      <Typography variant="h6" color="error">
        Failed to load varietals: {error instanceof Error ? error.message : 'Unknown error'}
      </Typography>
    );
  }

  return (
    <div>
      <VarietalList varietals={varietals} />
    </div>
  );
}
