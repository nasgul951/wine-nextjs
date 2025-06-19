'use client'
import React, { useState, useEffect } from 'react';
import type { Wine, WineFilter } from '../../../../types/wine';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import TablePagination from '@mui/material/TablePagination';
import Skeleton from '@mui/material/Skeleton';
import { Alert, Avatar, Card, CardContent, CardHeader, Divider, ListItemButton, Typography } from '@mui/material';
import { useWineService } from '../../../../hooks/useWineService';
import WineDialog from '../../../../components/wineDialog';

const WineListSkeleton = ({ count = 10 }) => (
  <List>
    {Array.from({ length: count }).map((_, idx) => (
      <ListItem key={idx} divider>
        <ListItemText
          primary={<Skeleton width="60%" />}
          secondary={<Skeleton width="40%" />}
        />
      </ListItem>
    ))}
  </List>
);

const WineList = ({ 
  wines, 
  page, 
  pageSize, 
  totalCount,
  selectedId, 
  setPage,
  setSelectedId
}: { 
  wines: Wine[],
  page: number,
  pageSize: number,
  totalCount: number,
  selectedId?: number,
  setPage: (page: number) => void,
  setSelectedId: (id: number) => void
}) => {
  return (
    <>
      <List>
        {wines.map((wine) => (
          <>
            <ListItemButton 
              key={wine.id}
              selected={selectedId === wine.id}
              onClick={() => setSelectedId(wine.id)}
            >
              <ListItemText
                primary={wine.vineyard}
                secondary={`${wine.label} - ${wine.varietal} (${wine.vintage})`}
              />
              <Typography variant="caption" color="text.secondary" sx={{ marginLeft: 1 }}>
                {wine.count} bottles
              </Typography>
            </ListItemButton>
          </>
        ))}
      </List>
      {/* TablePagination below the list */}
      <TablePagination
        component="div"
        count={totalCount}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage + 1)}
        rowsPerPage={pageSize}
        onRowsPerPageChange={() => {}}
        rowsPerPageOptions={[pageSize]}
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} of ${count === -1 ? 'many' : count}`
        }
      />
    </>
  );
}

function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name: string) {
  const names = name.split(' ');
  if (names.length < 2) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: name[0],
    };
  }

  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${names[0][0]}${names[1][0]}`,
  };
}

export default function Page({ params }: { params: { varietal: string } }) {
  const wineService = useWineService();
  const [wines, setWines] = useState<Wine[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const pageSize = 10
  const { varietal } = React.use(params);

  const varietalName = decodeURIComponent(varietal);

  useEffect(() => {
    const fetchWines = async () => {
      const filter: WineFilter = { varietal: varietalName };
      try {
        const response = await wineService.getWines({ page, pageSize, filter});
        setWines(response.data.items);
        setTotalCount(response.data.totalCount);
      } catch (error) {   
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    fetchWines();
  }, [page, varietalName, pageSize, wineService]);

  return (
    <>
      <Card 
        className="w-lg"
      >
        <CardHeader
          avatar={
            <Avatar {...stringAvatar(varietalName)}/>
          }
          title={
            <Typography variant="h5" component="div">
              { varietalName }
            </Typography>
          }
        />
        <CardContent>
          <Divider />
          {loading ? (
            <WineListSkeleton count={pageSize} />
          ) : error ? (
            <Alert severity="error">
              {error}
            </Alert>
          ) : (
            <WineList 
              wines={wines} 
              page={page}
              pageSize={pageSize}
              totalCount={totalCount}
              selectedId={selectedId ?? undefined}
              setPage={setPage}
              setSelectedId={setSelectedId}
            />
          )}
        </CardContent>
      </Card>
      <WineDialog
        isOpen={selectedId !== null}
        wine={wines.find(wine => wine.id === selectedId)}
        onClose={() => setSelectedId(null)}
      />
    </>
  )
}