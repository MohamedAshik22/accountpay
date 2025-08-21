// src/components/AdPlaceholder.tsx
import React from "react";

const AdPlaceholder: React.FC = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "70px",
        background: "#f5f5f5",
        color: "#444",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "2px dashed #bbb",
        borderRadius: "8px",
        margin: "1rem 0",
        fontSize: "1rem",
        fontWeight: "bold",
      }}
    >
      📢 Sample Ad Space
    </div>
  );
};

export default AdPlaceholder;
