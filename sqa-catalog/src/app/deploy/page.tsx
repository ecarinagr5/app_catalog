'use client';

import { useState, useCallback } from "react";

export default function Deploy() {
  const [uploading,] = useState(false);

  const uploadFiles = useCallback(async () => {
    console.log("Uploading files...");
  }, []);


  return (
    <div className="p-6 border border-dashed rounded-md text-center">
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded cursor-pointer"
        onClick={uploadFiles}
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Upload to Azure"}
      </button>
    </div>
  );
}
