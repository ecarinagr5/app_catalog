'use client';
import sendDataToApi from "../middleware/sendDataToApi";
import Footer from "../components/Footer";
import { useState } from "react";


export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [dragging, setDragging] = useState(false);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);
    setMessage("");

    try {
      const response = await sendDataToApi('/api/sendFile', formData);
      if (response?.message === "OK") {
        const data = await response.json();
        setMessage(`File uploaded successfully: ${data.url}`);
      } else {
        setMessage("Upload failed");
      }
    } catch (error) {
      setMessage(`Error: ${error}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      setFile(files[0]);
    }
  };


  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start item-center ">
        <h1 className="text-3xl font-bold">SQA Cloud</h1>
        <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2 tracking-[-.01em]">
            Get started pushing catalog{" "}.
          </li>
          <li className="tracking-[-.01em]">
            Save and see your push instantly.
          </li>
        </ol>

        <div className="flex flex-col md:flex-row space-y-4 md:space-x-4">
          {/* First Box Button */}
          <div className="flex flex-col items-center bg-white rounded-lg shadow-md w-[200px] px-3 border-2 border-dashed text-center border-gray-300 md:ml-0 md:w-[600px] py-10 h-40">
            <input type="file" accept=".csv" onChange={handleFileChange} className="border p-4 rounded md:w-90 w-30 text-xs" />
            {message && <p className="mt-2 text-sm">{message}</p>}
          </div>
          <div className="flex bg-white rounded-lg shadow-md w-[200px] ml-0 md:ml-5 md:w-[400px]">
            {/* Second Box with Drag and Drop */}
            <div
              className={`flex bg-white rounded-lg shadow-md w-full p-10 justify-center items-center border-2 border-dashed text-center ${dragging ? 'border-blue-500' : 'border-gray-300'}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {file ? <p>{file?.name}</p> : <p>Drag & Drop your  catalog here</p>}
            </div>
          </div>

        </div>
        <div className="flex flex-col items-center justify-center w-full">
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="bg-black text-white md:px-4 md:py-2 rounded m-2 text-sm p-2 w-[200px]"
          >
            {uploading ? "Deploying..." : "Deploy Catalog"}
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
