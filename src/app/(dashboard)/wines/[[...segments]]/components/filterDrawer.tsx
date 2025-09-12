import * as React from 'react';
import { 
  Button, 
  Drawer, 
  FormControl, 
  InputLabel, 
  MenuItem, 
  Select, 
  SelectChangeEvent, 
  Typography 
} from '@mui/material';
import { WineFilter } from '../../../../../types/wine';

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  filter: WineFilter | undefined;
  vineyards: string[];
  varietals: string[];
  onFilterChange: (name: keyof WineFilter, value: WineFilter[keyof WineFilter]) => void;
  onResetFilters: () => void;
}

const FilterDrawer: React.FC<FilterDrawerProps> = ({
  open,
  onClose,
  filter,
  vineyards,
  varietals,
  onFilterChange,
  onResetFilters
}) => {
  const handleVineyardChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    onFilterChange('vineyard', value === 'All' ? undefined : value);
  };

  const handleVarietalChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    onFilterChange('varietal', value === 'All' ? undefined : value);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
    >
      <div style={{ width: 300, padding: 20 }}>
        <Typography variant="h6" component="div" gutterBottom>
          Filter Wines
        </Typography>
        
        <FormControl fullWidth margin="normal">
          <InputLabel id="vineyard-select-label">Vineyard</InputLabel>
          <Select
            labelId="vineyard-select-label"
            id="vineyard-select"
            value={filter?.vineyard || 'All'}
            label="Vineyard"
            onChange={handleVineyardChange}
          >
            <MenuItem value="All">All Vineyards</MenuItem>
            {vineyards.map((vineyard) => (
              <MenuItem key={vineyard} value={vineyard}>{vineyard}</MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <FormControl fullWidth margin="normal">
          <InputLabel id="varietal-select-label">Varietal</InputLabel>
          <Select
            labelId="varietal-select-label"
            id="varietal-select"
            value={filter?.varietal || 'All'}
            label="Varietal"
            onChange={handleVarietalChange}
          >
            <MenuItem value="All">All Varietals</MenuItem>
            {varietals.map((varietal) => (
              <MenuItem key={varietal} value={varietal}>{varietal}</MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <Button 
          variant="contained" 
          color="primary" 
          fullWidth 
          onClick={onResetFilters}
          style={{ marginTop: 20 }}
        >
          Reset Filters
        </Button>
      </div>
    </Drawer>
  );
};

export default FilterDrawer;
