import * as React from 'react';
import VineyardSelect from '@components/vineyardSelect';
import VarietalSelect from '@/components/varietalSelect';
import { 
  Button, 
  Drawer, 
  Typography 
} from '@mui/material';
import { WineFilter } from '@/types/wine';

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  filter: WineFilter | undefined;
  onFilterChange: (name: keyof WineFilter, value: WineFilter[keyof WineFilter]) => void;
  onResetFilters: () => void;
}

const FilterDrawer: React.FC<FilterDrawerProps> = ({
  open,
  onClose,
  filter,
  onFilterChange,
  onResetFilters
}) => {

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

        <VineyardSelect
          value={filter?.vineyard}
          onSelectChange={(value?: string) => onFilterChange('vineyard', value)}
        />
        
        <VarietalSelect
          value={filter?.varietal}
          onSelectChange={(value?: string) => onFilterChange('varietal', value)}
        />

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
