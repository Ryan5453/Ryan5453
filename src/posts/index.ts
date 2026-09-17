import type { ComponentType } from 'react';
import type { PostMeta } from '../components/BlogPost';

import * as keysNotIncluded from './keys-not-included';
import * as doYouKnowYourCitizen from './do-you-know-your-citizen';
import * as insecureByDesign from './insecure-by-design';

export interface Post {
  meta: PostMeta;
  Component: ComponentType;
}

/**
 * Every post on the site. The blog index and the router both read from here, so
 * adding a post means creating one file in this directory and adding one line
 * below — there is nowhere for a title, date or slug to drift out of sync.
 *
 * Ordered newest-first for display.
 */
export const posts: Post[] = [
  keysNotIncluded,
  doYouKnowYourCitizen,
  insecureByDesign,
]
  .map((m) => ({ meta: m.meta, Component: m.default }))
  .sort((a, b) => b.meta.date.localeCompare(a.meta.date));
