"use client";

import * as React from 'react';
import { useParams } from 'next/navigation';
import { DataGrid, GridSortModel } from '@mui/x-data-grid';
import { Wine, WineFilter, GetWinesOptions } from '../../../../types/wine';
import { useWineService } from '../../../../hooks/service';
import { 
  Button, 
  Card, 
  CardActions, 
  CardContent, 
  FormControlLabel, 
  Switch, 
  useColorScheme 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import WineDetail from './components/wineDetail';
import FilterDrawer from './components/filterDrawer';
import { useRouter, notFound } from 'next/navigation';
import AlertBox from '../../../../components/alertBox';
import GridSkeletonLoader from '../../../../components/gridSkeletonLoader';

const WineGrid = () => {
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [filter, setFilter] = React.useState<WineFilter | undefined>(undefined);
  const [wines, setWines] = React.useState<Wine[]>([]);
  const [rowCount, setRowCount] = React.useState(0);
  const [paginationModel, setPaginationModel] = React.useState({ page: 0, pageSize: 10 });
  const [sortModel, setSortModel] = React.useState<GridSortModel>([]);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [vineyards, setVineyards] = React.useState<string[]>([]);
  const [varietals, setVarietals] = React.useState<string[]>([]);
  const wineService = useWineService();
  const router = useRouter();
  const { mode } = useColorScheme();

  React.useEffect(() => {
    const fetchWines = async () => {
      try {
        const options: GetWinesOptions = {
          page: paginationModel.page,
          pageSize: paginationModel.pageSize,
          filter: filter,
        };

        if (sortModel.length > 0) {
          options.sortModel = { 
            sort: sortModel[0].sort === 'asc' ? 'asc' : 'desc', 
            field: sortModel[0].field 
          };
        };

        const response = await wineService.getWines(options);
        if (!response.success)
        {
          throw new Error(`Failed to fetch wines: ${response.status}`);
        }
        
        setWines(response.data!.items);
        setRowCount(response.data!.totalCount);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unknown error');
      }
      setLoading(false);
    };
    fetchWines();
  }, [wineService, paginationModel, sortModel, filter]);

  // Fetch unique vineyards and varietals for filters
  React.useEffect(() => {
    if (wines.length > 0) {
      // Extract unique vineyards
      const uniqueVineyards = [...new Set(wines.map(wine => wine.vineyard))].sort();
      setVineyards(uniqueVineyards);
      
      // Extract unique varietals
      const uniqueVarietals = [...new Set(wines.map(wine => wine.varietal))].sort();
      setVarietals(uniqueVarietals);
    }
  }, [wines]);


  const handleFilterChange = (
    name: keyof WineFilter,
    value: WineFilter[keyof WineFilter]
  ) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      [name]: value,
    }));
  };

  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open);
  };

  const resetFilters = () => {
    setFilter({});
  };

  if (!mode)
  {
    return null;
  }

  if (loading) {
    return <GridSkeletonLoader/>;
  }
  
  return (
    <div>
      <AlertBox type="error" message={error} onClear={() => setError(null)} />

      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <FormControlLabel 
            control={
              <Switch 
                checked={filter?.showAll ?? false} 
                onChange={(e) => handleFilterChange('showAll', e.target.checked)} 
              />
            } 
            label="Show All" 
          />
          <Button 
            variant="outlined" 
            startIcon={<FilterListIcon />} 
            onClick={() => toggleDrawer(true)}
          >
            Filters
          </Button>
        </div>
      </CardContent>

      {/* Filter Drawer */}
      <FilterDrawer
        open={drawerOpen}
        onClose={() => toggleDrawer(false)}
        filter={filter}
        vineyards={vineyards}
        varietals={varietals}
        onFilterChange={handleFilterChange}
        onResetFilters={resetFilters}
      />

      <DataGrid 
        columns={[
          { field: 'id', headerName: 'ID', width: 80 },
          { field: 'vintage', headerName: 'Vintage', width: 90, align: 'center' },
          { field: 'vineyard', headerName: 'Vineyard', width: 150 },
          { field: 'label', headerName: 'Label', width: 150 },
          { field: 'varietal', headerName: 'Varietal', width: 150 },
          { field: 'count', headerName: 'Bottles', width: 80, align: 'right' },
        ]}
        rows={wines}
        rowCount={rowCount}
        paginationMode='server'
        loading={loading}
        pageSizeOptions={[10, 15, 20]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        sortingMode='server'
        onSortModelChange={setSortModel}
        onRowClick={(params) => { router.push(`/wines/${params.row.id}/edit`); }}
      />
    </div>
  );
}

export default function WinesPage() {
  const params = useParams();
  const [wineId, action] = params.segments ?? [];
  const router = useRouter();

  return (
    <React.Fragment>
      <div className="flex justify-center">
        {wineId && action === 'edit' ? (
          <WineDetail wineId={Number(wineId)} />
        ): wineId === 'new' ? (
          <WineDetail 
            onInsert={(newWineId) => {
              // Redirect to the new wine detail page after insertion
              router.push(`/wines/${newWineId}/edit`);
            }}
          />
        ): !wineId ? (
          <Card>
            <CardActions sx={ { justifyContent: 'flex-end' } }>
              <Button 
                size="small" 
                variant="contained" 
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => { router.push('/wines/new'); }}
              >
                Add Wine
              </Button>
            </CardActions>
            <CardContent>
              <WineGrid />
            </CardContent>
          </Card>
        ):
          notFound()
        }
      </div>
    </React.Fragment>
  );
}
