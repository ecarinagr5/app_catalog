import { NextResponse } from 'next/server';
import { BlobServiceClient, StorageSharedKeyCredential } from '@azure/storage-blob';

// Azure Storage Credentials
const AZURE_STORAGE_ACCOUNT_NAME = process.env.AZURE_STORAGE_ACCOUNT_NAME; // Your Azure Storage Account Name
const AZURE_STORAGE_ACCOUNT_KEY = process.env.AZURE_STORAGE_ACCOUNT_KEY;   // Your Azure Storage Account Key
// const AZURE_STORAGE_ACCOUNT_NAME = "carinatestqa12"
// const AZURE_STORAGE_ACCOUNT_KEY = "RJS0LB6o2LRr9wLnUGmZfYHpUELx19YWGR8JnQ614E6GGJri24SWlUqfOgfO+uUSuyVA6XkzKKJL+AStnAWaJQ=="
//const AZURE_STORAGE_ACCOUNT_NAME = "fc4d63ed66f784fbcb89e7"
//const AZURE_STORAGE_ACCOUNT_KEY = "PoL7CBXMPfY/6VPyCLb575XwdAApi5ykkt0jI8tBqLgh8aQKRzwceHS5Y3EP2JIuX5Lt3w+teQRh+AStbavU"
const CONTAINER_NAME = "csv-uploads";

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(request) {
  try {
    // Read CSV file as raw text
    const data = await request.text();
    console.log('Received CSV Data:', data);

    // Set up Azure Blob Service Client
    const credentials = new StorageSharedKeyCredential(AZURE_STORAGE_ACCOUNT_NAME, AZURE_STORAGE_ACCOUNT_KEY);
    const blobServiceClient = new BlobServiceClient(
      `https://${AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
      credentials
    );
    const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
    // Generate a unique filename (you can modify this as needed)
    const fileName = `upload_${Date.now()}.csv`;

    // Get a reference to the blob (the file you're uploading)
    const blobClient = containerClient.getBlockBlobClient(fileName);

    // Convert data to Buffer
    const buffer = Buffer.from(data, 'utf-8');

    // Upload CSV file to Azure Blob Storage
    // TODO: VALIDAR NOMBRE Y TIMESTAMP
    await blobClient.upload(buffer, buffer.length, {
      blobHTTPHeaders: { 'x-ms-blob-content-type': 'text/csv' }
    });

    const fileUrl = blobClient.url;  // URL of the uploaded file

    // Create response with the URL of the uploaded file
    const response = NextResponse.json({ message: 'OK', fileUrl });

    // Set CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: `Something went wrong: ${error.message}` },
      { status: 500 }
    );
  }
}
