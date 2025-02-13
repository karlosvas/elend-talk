<script>
   import { setAppStatusLoading, setAppStatusError, setAppStatusChatMode } from '../utils/store';
   import Dropzone from "svelte-file-dropzone";
   import { extractTextFromPDF } from '..//utils/pdfjs';
   // import { submitContext } from '../utils/context';

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

        const { id, url, page, text } = await extractTextFromPDF(acceptedFiles[0]);

        // TODO: subir contexto a public
      //   submitContext(text, id);
        
        setAppStatusChatMode({ id, url, page });
        
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