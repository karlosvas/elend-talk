<script lang="ts">
   import { setAppStatusLoading, setAppStatusError, setAppStatusChatMode } from '@/utils/store';
   import Dropzone from "svelte-file-dropzone";
   import { extractTextFromPDF } from '@/utils/pdfjs';
   import { appStatusInfo } from '@/utils/store';
  import  { type PDFInfo } from '@/types/types';

   // Archivos aceptados y rechazados
   let files: Record<string, any[]> = {
      accepted: [],
      rejected: []
   };

   // Manejador de archivos seleccionados, al hacer drag n drop o hacer click en el dropzone 
   async function handleFilesSelect(e: CustomEvent) {
    try {
      // Obtenemos el modelo seleccionado del select
      const modelSelect = document.getElementById("model-select") as HTMLSelectElement | null;

      if(modelSelect && modelSelect.value === "") 
            throw new Error("You must select a model before uploading a file");

         // Vlaidamos que solo se haya subido un archivo y que sea un pdf
         const { acceptedFiles, fileRejections } = e.detail;
         files = { 
            accepted: [...files.accepted, ...acceptedFiles],
            rejected: [...files.rejected, ...fileRejections]
         };
         if(files.rejected.length > 0) 
            throw new Error("Only PDF files are allowed");

         // Cambiamos el estado de la aplicacion a loading para activar el spinner
         setAppStatusLoading();

         // Extreamos información del pfd, se lo damos al estado de la aplicacion y lo subimos al servidor
        let newInfo: PDFInfo = {
         id: "",
         url: "",
         pages: 0,
         text: '',
         images: []
      };
         
         for(const file of acceptedFiles) {
            let info = await extractTextFromPDF(file);
            newInfo = {
               id: newInfo + "\n" + file.name,
               url: newInfo.url +"\n" + URL.createObjectURL(file),
               pages:  newInfo.pages + info.pages,
               text: newInfo.text + "\n" + info.text,
               images: [...newInfo.images, ...info.images]
            };
            // Solo continuamos cuando TODOS los archivos han sido procesados con éxito
            if(!info.text) 
               throw new Error("The text could not be extracted from the PDF");
         }
         
         appStatusInfo.set(newInfo);

        

         // Subimos el contexto al chat de Ollama
         try {

            const response = await fetch('/api/upload', {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json'
               },
               body: JSON.stringify({ context: newInfo.text })
            });

            if(!response.ok) 
               throw new Error("Error uploading file");
         } catch (error) {
            console.error(error);
         }
         
         // Si todo ha salido bien pasamos al modo chat
         setAppStatusChatMode();
   } catch (error: unknown) {
      console.error(error);
      if(error instanceof Error)
         setAppStatusError(error.message);
      else
         setAppStatusError("Error uploading file");
   }
}
</script>

<!-- Si aun no hay archivos subidos, mostramos el drag and drop -->
{#if files.accepted.length === 0}
      <Dropzone
      accept='application/pdf'
      multiple={true}
      on:drop={handleFilesSelect}>
      </Dropzone>
{/if}