/**
 * mediaHelpers - Utility functions for media type detection and handling
 * 
 * Provides helper functions for determining media types from file extensions
 * and handling media-specific logic across the application.
 * 
 * @module Utils/mediaHelpers
 */

/**
 * Detect media type from file extension
 * 
 * Analyzes the file extension of a given URL to determine the media type.
 * Supports video formats (mp4, webm, mov), GIF, SVG, and generic images.
 * 
 * @param {string} url - File URL or path with extension
 * @returns {string} Media type: 'video', 'gif', 'svg', or 'image'
 * 
 * @example
 * getMediaType('demo.mp4') // 'video'
 * getMediaType('logo.svg') // 'svg'
 * getMediaType('photo.jpg') // 'image'
 */
export const getMediaType = (url) => {
  if (!url) return 'image';
  const ext = url.toLowerCase().split('.').pop().split('?')[0];
  if (['mp4', 'webm', 'mov'].includes(ext)) return 'video';
  if (['gif'].includes(ext)) return 'gif';
  if (['svg'].includes(ext)) return 'svg';
  return 'image';
};
