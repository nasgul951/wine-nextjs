"use client"
import * as React from 'react';
import Typography from '@mui/material/Typography';
import { PieChart } from '@mui/x-charts/PieChart';
import AlertBox from '../../components/alertBox';
import { useRouter } from 'next/navigation';
import { useWineService } from '../../hooks/useWineService';


interface IChartSeriesData {
  id: number;
  value: number;
  label: string;
}

export default function HomePage() {
  const [data, setData] = React.useState<IChartSeriesData[] | undefined>(undefined);
  const [error, setError] = React.useState<string | null>(null);
  const [chartSize, setChartSize] = React.useState({ width: 300, height: 300 });
  const wineService = useWineService();
  const router = useRouter();

  React.useEffect(() => {
    const handleResize = () => {
      const width = Math.min(window.innerWidth * 0.8, 500); // Adjust width based on viewport
      const height = width; // Keep the chart square
      setChartSize({ width, height });
    };

    handleResize(); // Set initial size
    window.addEventListener("resize", handleResize); // Update size on window resize

    return () => {
      window.removeEventListener("resize", handleResize); // Cleanup event listener
    };
  }, []);

  React.useEffect(() => {
    const fetchData = async () => { 
      try {
        const response = await wineService.getVarietals();
        const seriesData = response.data.map((v, idx) => ({
          id: idx,
          value: v.count,
          label: v.name
        }));
        setData(seriesData);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load varietals');
      }
    }
    fetchData();
  }, [wineService]);


  return (
    <div>
      <AlertBox type="error" message={error} onClear={() => setError(null)} />
      <PieChart
        series={[
          data ? { 
            innerRadius: 12,
            data: data 
          } : { data: [] }
        ]}
        title="Wine Varietals Distribution"
        height={chartSize.height}
        width={chartSize.width}
        onItemClick={(e,d) => {
          const label = data?.find(item => item.id === d.dataIndex)?.label ?? null;
          if (!label) return;
          router.push(`/varietals/${encodeURIComponent(label)}`);
        }}
      />
    </div>
  );
}
