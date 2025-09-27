import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useWineService } from '@hooks/service';
import React from 'react';

interface VineyardSelectProps {
  value?: string;
  onSelectChange: (value?: string) => void;
}

const VineyardSelect: React.FC<VineyardSelectProps> = ({ 
  value,
  onSelectChange 
}) => { 
  const [vineyards, setVineyards] = React.useState<string[]>([]);
  const wineService = useWineService();

  React.useEffect(() => {
    const fetchVineyards = async () => {
      try {
        const response = await wineService.getVineyards();
        if (response.success && response.data) {
          setVineyards(response.data.map(v => v.name));
        } else {
          console.error('Failed to fetch vineyards');
        }
      }
      catch (error) {
        console.error('Error fetching vineyards:', error);
      }
    };

    fetchVineyards();
  }, [wineService]);

  const handleVineyardChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    onSelectChange(value === 'All' ? undefined : value);
  };

  return (
    <>
      <FormControl fullWidth margin="normal">
        <InputLabel id="vineyard-select-label">Vineyard</InputLabel>
        <Select
          labelId="vineyard-select-label"
          id="vineyard-select"
          value={value || 'All'}
          label="Vineyard"
          onChange={handleVineyardChange}
        >
          <MenuItem value="All">All Vineyards</MenuItem>
          {vineyards.map((vineyard) => (
            <MenuItem key={vineyard} value={vineyard}>{vineyard}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
}

export default VineyardSelect;