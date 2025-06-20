import React from "react";
import { Skeleton } from "@mui/material";

export default function GridSkeletonLoader() {
  const skeletonItems = Array.from({ length: 12 }); // Simulate 12 grid items

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
      {skeletonItems.map((_, index) => (
        <div key={index} style={{ padding: "16px", border: "1px solid #ddd", borderRadius: "8px" }}>
          <Skeleton variant="rectangular" width="100px" />
        </div>
      ))}
    </div>
  );
}