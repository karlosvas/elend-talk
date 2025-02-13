import { MAX_IMAGES_TO_SHOW } from "../config/constants";

export function getCloudinaryImg(url: string, pages: number): string[] {
  // Máximo de imagenes para mostrar
  const maxImagesToShow = Math.min(pages, MAX_IMAGES_TO_SHOW);

  // Por cada una de las imagenes cambiamos el tamaño utilizando cloudinary
  return Array.from({ length: maxImagesToShow }, (_, i) => {
    const page = i + 1;
    return url.replace("/upload/", `/upload/w_400,h_540,c_fill,pg_${page}/`).replace(".pdf", ".jpg");
  });
}

// DEPRECATED: Creditos terminados
// const formData = new FormData();
// formData.append('file', acceptedFiles[0]);
// Enviamos el archivo al servidor para alamcenarlo en cloudinary
// const res = await fetch('api/upload', {
//    method: 'POST',
//    body: formData,
//    headers: {
//       'Accept': 'application/json'
//    }
// });
// Si hay un error, pasamos a estado de error
//if(!res.ok) {
//    setAppStatusError();
//    return;
// }

// // Obtenemos la respuesta del servidor
// const { id, url, pages } = await res.json();
// setAppStatusChatMode({ id, url, pages });
