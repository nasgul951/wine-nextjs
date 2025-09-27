import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import React from 'react';
import { useWineService } from '@/hooks/service';

interface VarietalSelectProps {
  value?: string;
  onSelectChange: (value?: string) => void;
}

const VarietalSelect: React.FC<VarietalSelectProps> = ({ 
  value,
  onSelectChange 
}) => { 
  const [varietals, setVarietals] = React.useState<string[]>([]);
  const wineService = useWineService();

  React.useEffect(() => {
    const fetchVarietals = async () => {
      try {
        const response = await wineService.getVarietals();
        if (response.success && response.data) {
          setVarietals(response.data.map(v => v.name));
        } else {
          console.error('Failed to fetch varietals');
        }
      }
      catch (error) {
        console.error('Error fetching varietals:', error);
      }
    };

    fetchVarietals();
  }, [wineService]);

  const handleVarietalChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    onSelectChange(value === 'All' ? undefined : value);
  };

  return (
    <>
      <FormControl fullWidth margin="normal">
        <InputLabel id="varietal-select-label">Varietal</InputLabel>
        <Select
          labelId="varietal-select-label"
          id="varietal-select"
          value={value || 'All'}
          label="Varietal"
          onChange={handleVarietalChange}
        >
          <MenuItem value="All">All Varietals</MenuItem>
          {varietals.map((varietal) => (
            <MenuItem key={varietal} value={varietal}>{varietal}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
}

export default VarietalSelect;