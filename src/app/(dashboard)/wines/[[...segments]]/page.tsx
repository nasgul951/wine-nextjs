"use client";

import * as React from 'react';
import { DataGrid, GridSortModel } from '@mui/x-data-grid';
import { Wine, GetWinesOptions } from '../../../../types/wine';
import { useWineService } from '../../../../hooks/useWineService';
import { Alert, Container, useColorScheme } from '@mui/material';
import WineDetail from './components/wineDetail';
import { useRouter } from 'next/navigation';

const WineGrid = () => {
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [wines, setWines] = React.useState<Wine[]>([]);
  const [rowCount, setRowCount] = React.useState(0);
  const [paginationModel, setPaginationModel] = React.useState({ page: 0, pageSize: 10 });
  const [sortModel, setSortModel] = React.useState<GridSortModel>([]);
  const wineService = useWineService();
  const router = useRouter();
  const { mode } = useColorScheme();

  React.useEffect(() => {
    const fetchWines = async () => {
      try {
        const options: GetWinesOptions = {
          page: paginationModel.page,
          pageSize: paginationModel.pageSize
        };

        if (sortModel.length > 0) {
          options.sortModel = { 
            sort: sortModel[0].sort === 'asc' ? 'asc' : 'desc', 
            field: sortModel[0].field 
          };
        };

        const response = await wineService.getWines(options);
        setWines(response.data.items);
        setRowCount(response.data.totalCount);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unknown error');
      }
      setLoading(false);
    };
    fetchWines();
  }, [wineService, paginationModel, sortModel]);

  if (!mode)
  {
    return null;
  }

  return (
    <div>
      {error && (
        <Alert severity="error" style={{ marginBottom: '20px' }}>
          <strong>Error:</strong> {error}
        </Alert>
      )}
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

export default function WinesPage({ params }: { params: { segments: string[] } }) {
  const { segments } = React.use(params);
  const [wineId, action] = segments ?? [];
  return (
    <React.Fragment>
      <div className="flex justify-center">
        {wineId && action ? (
          <WineDetail wineId={wineId} />
        ) : (
          <WineGrid />
        )}
      </div>
    </React.Fragment>
  );
}
