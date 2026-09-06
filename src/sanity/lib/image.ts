import createImageUrlBuilder from '@sanity/image-url';
import { projectId, dataset } from '../config';

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || '',
  dataset: dataset || '',
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlForImage(source: any) {
  return imageBuilder.image(source).auto('format').fit('max');
}
