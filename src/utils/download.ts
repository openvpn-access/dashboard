/**
 * Triggers a file download
 * @param name Name of file
 * @param content Content
 */
export const downloadFile = (name: string, ...content: Array<BlobPart>) => {
    const url = window.URL.createObjectURL(new Blob(content));
    const link = document.createElement('a');
    link.style.display = 'none';
    link.download = name;
    link.href = url;

    // Trigger download
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
};
