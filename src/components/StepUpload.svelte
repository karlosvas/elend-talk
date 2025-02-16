<script>
   import { setAppStatusLoading, setAppStatusError, setAppStatusChatMode } from '@/utils/store';
   import Dropzone from "svelte-file-dropzone";
   import { extractTextFromPDF } from '@/utils/pdfjs';
   import { appStatusInfo } from '@/utils/store';

   // Archivos aceptados y rechazados
   let files = {
      accepted: [],
      rejected: []
   };

   async function handleFilesSelect(e) {
    try {
        const { acceptedFiles, fileRejections } = e.detail;
        files = { 
            accepted: [...files.accepted, ...acceptedFiles],
            rejected: [...files.rejected, ...fileRejections]
         };

         if(files.rejected.length > 0) {
            console.error('Solo se permiten archivos PDF');
            setAppStatusError();
            return;
         }

        setAppStatusLoading();

         // Extreamos informacion del pfd, se lo damos al estado de la aplicacion y lo subimos al servidor
         const newInfo = await extractTextFromPDF(acceptedFiles[0]);
         appStatusInfo.set(newInfo);

         // Lo almacenamos en public
         try {
            const info = {
               id: newInfo.id,
               context: newInfo.text
            }
            const response = await fetch('/api//upload', {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json'
               },
               body: JSON.stringify(info)
            });

            if(!response.ok) {
               console.error('Error al subir el archivo');
               setAppStatusError();
               return;
            }

         }  catch(e){
            console.error(e);
            setAppStatusError();
         }
         
         // Si todo ha salido bien pasamos al modo chat
         setAppStatusChatMode();
   } catch (error) {
      console.error(error);
      setAppStatusError();
   }
}
</script>

<!-- Si aun no hay archivos subidos, mostramos el grag and drop -->
{#if files.accepted.length === 0}
   <Dropzone
      accept='application/pdf'
      multiple={false}
      on:drop={handleFilesSelect}>
   </Dropzone>
{/if}