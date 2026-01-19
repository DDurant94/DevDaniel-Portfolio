// Returns media type based on file extension
export const getMediaType = (url) => {
  if (!url) return 'image';
  const ext = url.toLowerCase().split('.').pop().split('?')[0];
  if (['mp4', 'webm', 'mov'].includes(ext)) return 'video';
  if (['pdf'].includes(ext)) return 'pdf';
  if (['gif'].includes(ext)) return 'gif';
  if (['svg'].includes(ext)) return 'svg';
  return 'image';
};
