'use client'
import React from "react";
import { IStoreLocation } from "../../../../types/wine"
import { WineStore } from '../../../../data/store';
import { useParams } from "next/navigation";
import { CircularProgress, Card, Paper } from '@mui/material'
import BinList from "../../../../components/binList";
import { useWineService } from "../../../../hooks/service";
const wineStore = new WineStore(5);

interface IBinContent {
  id: number
  count: number
  isDouble: boolean
  isRow: boolean
}

const parseContents = (data: IStoreLocation[]): Array<IBinContent> => {
  const store = Array<IBinContent>()
  let ix = 0
  let d = data[ix]

  // treat 0 as single bin
  let topCount = 0;
  while (d.binY == 0) {
    topCount += d.count
    d = data[++ix]
  }
  store.push({
    id: wineStore.packBinId(0, 0),
    count: topCount,
    isDouble: true,
    isRow: true
  })

  for (let y = 1; y <= 15; y++) {
    for (let x = 1; x <= 6; x++) {
      if (d && (y == d.binY) && (x == d.binX)) {
        store.push({
          id: wineStore.packBinId(x, y),
          count: d.count,
          isRow: false,
          isDouble: false
        })
        d = data[++ix]
      } else {
        store.push({
          id: wineStore.packBinId(x, y),
          count: 0,
          isRow: false,
          isDouble: false
        })
      }
    }
  }

  // bottom as single bin
  let bottomCount = 0
  while (d && d.binY == 16) {
    bottomCount += d.count
    d = data![++ix]
  }
  store.push({
    id: wineStore.packBinId(0, 16),
    count: bottomCount,
    isDouble: true,
    isRow: true
  })

  return store;
}

type StorageBinProps = {
  storeId: number,
  onBinSelected: (binId: number) => void
  refresh?: number
  onError?: (error: Error) => void
}

const StorageBin = (
  {
    storeId,
    onBinSelected,
    refresh,
    onError
  }: StorageBinProps
) => {
  const [loading, setLoading] = React.useState(true);
  const [bins, setBins] = React.useState<Array<IBinContent>>([]);
  const wineService = useWineService();

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await wineService.getStoreInventory(storeId);
        if (!result.success) {
          throw new Error(`Failed to fetch store inventory: ${result.errors!.join('\n')}`);
        }
        const parsedData = parseContents(result.data!);
        setBins(parsedData);
      } catch (error) {
        if (onError && error instanceof Error) {
          onError(error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [storeId, wineService, refresh, onError]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    bins.map((bin) => {
      const classes = [
        "flex",
        "items-center",
        "justify-center",
        "box-content",
        bin.isDouble ? "h-16 pb-1" : "h-8",
        bin.isRow ? "col-span-6" : "",
      ]
        .filter(Boolean)
        .join(" ");

      return (
        <Paper
          elevation={bin.count !== 0 ? 2 : 1}
          className={classes} key={bin.id}
          onClick={() => onBinSelected(bin.id)}
        >
          {bin.count !== 0 && <div>{bin.count}</div>}
        </Paper>
      );
    })
  )
}


export default function Page() {
  const [selectedBin, setSelectedBin] = React.useState<number | null>(null);
  const [refreshKey, setRefreshKey] = React.useState<number>(0);
  const params = useParams();
  const { id: storeId } = params;

  return (
    <>
      <Card className="w-full md:w-xs">
        <div className="pa-5 grid grid-cols-6 gap-1 border-4 text-center">
          <StorageBin 
            storeId={Number(storeId)} 
            onBinSelected={(binId) => setSelectedBin(binId)}
            refresh={refreshKey}
          />
        </div>
      </Card>
      <BinList
        binId={selectedBin}
        open={selectedBin !== null}
        onClose={() => setSelectedBin(null)}
        onBottleDeleted={() => setRefreshKey(refreshKey+1) }
      />
    </>
  );
}
