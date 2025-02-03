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
