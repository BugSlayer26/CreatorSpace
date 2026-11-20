# CreatorSpace - Creative Services Marketplace

A frontend-only marketplace where clients discover creative professionals, browse services, save favourites and send project inquiries, and creators manage their profile, services, portfolio and inquiries from a dashboard.

**Stack:** React 18 (JavaScript) · Tailwind CSS 3 · React Router DOM 6 · LocalStorage · Vite

No backend, database, authentication or external APIs. All data is sample data in `src/data/`.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
npm run preview    # preview the production build
```

## Deploy to Vercel

1. Push this folder to a GitHub repository (`node_modules` and `dist` are git-ignored).
2. On vercel.com choose **Add New > Project** and import the repository.
3. Vercel detects Vite automatically (build command `npm run build`, output directory `dist`).
4. `vercel.json` rewrites all routes to `index.html`, so direct links and refreshes on routes such as `/services/s1` work.

## Features

| Area | What it does |
| --- | --- |
| Home | Hero with search, categories, featured services and creators, how it works, why choose us, CTA, footer |
| Explore Services | Search (title, creator, keywords), category filter, min/max price, sort (price asc/desc, rating), clear all, empty state. Filters are stored in the URL |
| Service Details | Image gallery, Basic/Standard/Premium packages, delivery time, skills, creator card, reviews, related services, wishlist and inquiry buttons |
| Creators | Searchable creator grid and full profile pages with portfolio, services and reviews |
| Wishlist | Heart toggle everywhere, navbar counter, dedicated page, persisted in LocalStorage |
| Inquiry Form | Validation (required fields, email format, min lengths, positive budget, future deadline), success state, saved to LocalStorage |
| Dashboard | Overview stats, edit profile, service CRUD, portfolio CRUD, inquiry list with details and Pending/Reviewed/Completed status, settings |

### Using the dashboard

There is no login. Open **/dashboard** (the "Creator Dashboard" link in the navbar). It manages Ayesha Malik by default; in **Settings** you can switch to any other creator. Services you add appear in the public marketplace immediately. Inquiries submitted through the form appear in the dashboard of the creator who owns the selected service. **Settings > Reset demo data** restores the original sample data.

### LocalStorage keys

`creatorspace:wishlist`, `creatorspace:creators`, `creatorspace:services`, `creatorspace:inquiries`, `creatorspace:settings`

## Project structure

```
src/
  components/   Navbar, Footer, ServiceCard, CreatorCard, SearchBar, FilterSidebar,
                CategoryCard, SectionHeading, Modal, EmptyState, Icons, ...
  pages/        Home, ExploreServices, ServiceDetails, Creators, CreatorProfile,
                Categories, Wishlist, Inquiry, About, Dashboard, NotFound
  dashboard/    Overview, MyProfile, MyServices, MyPortfolio, Inquiries, Settings
  data/         services.js, creators.js, categories.js, images.js, seedInquiries.js
  context/      AppContext.jsx, WishlistContext.jsx
  hooks/        useLocalStorage.js
  utils/        helpers.js
```

## Notes

- Images are loaded from Unsplash. If one fails to load, an inline placeholder is shown instead, so layouts never break.
- Before submitting the assignment, delete the `node_modules` folder (it is already excluded from the provided zip).
