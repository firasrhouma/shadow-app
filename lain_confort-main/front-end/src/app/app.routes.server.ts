// src/app.server.routes.ts
import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Don’t try to prerender parameterized routes — render them per-request instead:
  { path: 'products/:id', renderMode: RenderMode.Server },
  { path: 'categories/:id', renderMode: RenderMode.Server },

  // Optional: prerender simple static pages (home, product list)
  { path: '', renderMode: RenderMode.Prerender },      // root (redirect usually -> home)
  { path: 'home', renderMode: RenderMode.Prerender },  // prerender home page
  { path: 'products', renderMode: RenderMode.Prerender } // prerender products listing
];
