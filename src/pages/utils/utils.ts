import type { UploadApiResponse } from "cloudinary";
import cloudinary from "../../config/cloudinaryConfig";

// Server Sent Events
export const responseSSE = (
  { request }: { request: Request },
  callback: (sendEvent: (data: any) => void) => Promise<void>
) => {
  const body = new ReadableStream({
    async start(controller) {
      // Text encoder for converting strings to Uint8Array
      const encoder = new TextEncoder();

      // Send event to client
      const sendEvent = (data: any) => {
        const message = `data: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(message));
      };

      callback(sendEvent);

      // Handle the connection closing
      request.signal.addEventListener("abort", () => {
        controller.close();
      });
    },
  });

  return new Response(body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
};

// Subida de flujo a Cloudinary, convertir a binario y almacenarlo en un búfer.
export const uploadStream = async (buffer: Uint8Array): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const options = {
      folder: "pdf",
      ocr: "adv_ocr",
    };
    // Subir el flujo a Cloudinary
    cloudinary.uploader
      .upload_stream(options, (error, result) => {
        if (result) return resolve(result);
        reject(error);
      })
      .end(buffer);
  });
};
