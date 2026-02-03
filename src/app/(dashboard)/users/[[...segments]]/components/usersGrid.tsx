'use client';

import * as React from 'react';
import { DataGrid, GridColDef, GridSortModel } from '@mui/x-data-grid';
import { Chip, TextField, InputAdornment, Box } from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SearchIcon from '@mui/icons-material/Search';
import { useRouter } from 'next/navigation';
import { User, UserFilter } from '@/types/user';
import { useUserService } from '@/hooks/service';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { IPagedRequest } from '@/types';
import AlertBox from '@/components/alertBox';
import GridSkeletonLoader from '@/components/gridSkeletonLoader';

const formatLastOn = (date: Date | string | null): string => {
  if (!date) return 'Never';

  const lastOn = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - lastOn.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;

  return lastOn.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const columns: GridColDef[] = [
  {
    field: 'username',
    headerName: 'Email',
    flex: 1,
    minWidth: 200
  },
  {
    field: 'lastOn',
    headerName: 'Last On',
    width: 180,
    valueFormatter: (value: Date | string | null) => formatLastOn(value)
  },
  {
    field: 'isAdmin',
    headerName: 'Role',
    width: 120,
    renderCell: (params) =>
      params.value ? (
        <Chip
          icon={<AdminPanelSettingsIcon />}
          label="Admin"
          color="primary"
          size="small"
          variant="outlined"
        />
      ) : null
  }
];

const UsersGrid = () => {
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [users, setUsers] = React.useState<User[]>([]);
  const [rowCount, setRowCount] = React.useState(0);
  const [paginationModel, setPaginationModel] = React.useState({ page: 0, pageSize: 10 });
  const [sortModel, setSortModel] = React.useState<GridSortModel>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const debouncedSearch = useDebouncedValue(searchTerm);

  const userService = useUserService();
  const router = useRouter();

  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        const filter: UserFilter | undefined = debouncedSearch
          ? { username: debouncedSearch }
          : undefined;

        const options: IPagedRequest<UserFilter> = {
          page: paginationModel.page,
          pageSize: paginationModel.pageSize,
          filter
        };

        if (sortModel.length > 0) {
          options.sortModel = {
            sort: sortModel[0].sort === 'asc' ? 'asc' : 'desc',
            field: sortModel[0].field
          };
        }

        const response = await userService.getUsers(options);
        if (!response.success) {
          throw new Error(`Failed to fetch users: ${response.status}`);
        }

        setUsers(response.data!.items);
        setRowCount(response.data!.totalCount);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unknown error');
      }
      setLoading(false);
    };

    fetchUsers();
  }, [userService, paginationModel, sortModel, debouncedSearch]);

  if (loading) {
    return <GridSkeletonLoader />;
  }

  return (
    <div>
      <AlertBox type="error" message={error} onClear={() => setError(null)} />

      <Box sx={{ mb: 2 }}>
        <TextField
          size="small"
          placeholder="Search by email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }
          }}
        />
      </Box>

      <DataGrid
        columns={columns}
        rows={users}
        rowCount={rowCount}
        paginationMode="server"
        loading={loading}
        pageSizeOptions={[10, 15, 20]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        sortingMode="server"
        onSortModelChange={setSortModel}
        onRowClick={(params) => router.push(`/users/${params.row.id}/edit`)}
        sx={{ cursor: 'pointer' }}
      />
    </div>
  );
};

export default UsersGrid;
