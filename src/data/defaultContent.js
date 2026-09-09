import release from './publishedRelease.json';

// Browser and pre-renderer share the exact deployed snapshot.
export const CONTENT_VERSION = release.contentVersion;
export const defaultContent = release.content;
