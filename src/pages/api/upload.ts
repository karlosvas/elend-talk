import type { APIRoute } from "astro";
import fs from 'node:fs/promises';
import path from 'node:path';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
   cloud_name: 'karlosvas',
   api_key: import.meta.env.CLOUDINARY_API_KEY,
   api_secret: import.meta.env.CLOUDINARY_SECRET
});

const oputDir = path.join(process.cwd(), 'public/text');

// Upload stream to Cloudinary, convert to binary and store it in a buffer.
const uploadStream = async (buffer: Uint8Array, options: {
   folder: string
   ocr?: string
}): Promise<UploadApiRespone> => {
   return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(options, (error, result) => {
         if (result) return resolve(result);
         reject(error);
      }).end(buffer);
   });
}

export const POST: APIRoute = async ({ request }) => {
   // Obtain the form data from the request
   const formData = await request.formData();
   const file = formData.get('file') as File;

   // Convert the file to array buffer
   if (file === null) {
      return new Response("No file found", { status: 400 });
   }
   const arrayBuffer = await file.arrayBuffer();
   const unit8Array = new Uint8Array(arrayBuffer);

   // Upload the file to Cloudinary
   const result = await uploadStream(unit8Array, {
      folder: 'pdf',
      ocr: 'adv_ocr'
   });

   const {
      asset_id: id,
      secure_url: url,
      pages,
      info
   } = result;

   const data = info?.ocr?.adv_ocr?.data;
   const text = data.map((blocks: { textAnnotations: { description: string }[] }) => {
      const annotations = blocks['textAnnotations'] ?? {};
      const first = annotations[0] ?? {};
      const content = first['description'] ?? '';
      return content.trim();
   }).filter(Boolean).join('\n');

   // Save the text to a file
   fs.writeFile(`${oputDir}/${id}.txt`, text, 'utf-8');

   // Simulate delay 3 sec.
   await new Promise((resolve) => setTimeout(resolve, 3000));
   return new Response(JSON.stringify({
      id,
      url,
      pages
   }));
}