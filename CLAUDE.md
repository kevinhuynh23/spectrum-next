# Spectrum Next — Claude Code Context

## Project Overview

Full-stack Next.js application with Apollo GraphQL backend. Built with Next.js Pages Router, Mantine UI, and Apollo Server for GraphQL API.

## Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 13+ (Pages Router) |
| Language | TypeScript |
| GraphQL Client | Apollo Client v3 |
| GraphQL Server | Apollo Server v4 |
| UI Framework | Mantine UI v6 |
| Styling | Emotion (@emotion/react, @emotion/server) |
| Rich Editor | TipTap v2 |
| Floating UI | @floating-ui/react |
| Package Manager | pnpm |

## Getting Started

```bash
# Bootstrap (install deps + setup husky)
pnpm run bootstrap

# Start dev server (http://localhost:3000)
pnpm run dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm run lint
```

## Project Structure

```
spectrum-next/
├── src/
│   ├── pages/           # Next.js pages (file-based routing)
│   │   ├── _app.tsx     # App wrapper, Apollo provider
│   │   ├── _document.tsx # HTML document
│   │   ├── api/         # API routes (becomes /api/*)
│   │   │   └── graphql.ts   # Apollo Server GraphQL endpoint
│   │   └── [other pages]
│   ├── common/          # Shared utilities
│   │   ├── gql/         # GraphQL queries/mutations (generated)
│   │   ├── constants/   # App constants
│   │   └── utils/       # Helper functions
│   ├── modules/         # Feature modules
│   │   └── [feature]/   # Feature folder
│   ├── styles/          # Global styles
│   ├── apollo.ts        # Apollo Client setup
│   └── [other]
├── .husky/              # Git hooks
├── pnpm-lock.yaml       # Dependency lock
└── next.config.js       # Next.js config
```

## Architecture

### Pages Router Setup
- Pages in `src/pages/` map to routes
- API routes in `src/pages/api/` handle HTTP requests
- `_app.tsx` wraps all pages with Apollo Provider and Mantine theme

### GraphQL Setup

**Apollo Server** runs as API route:
```typescript
// src/pages/api/graphql.ts
export default startServerAndCreateNextHandler(server);
```

**Apollo Client** configured in `src/apollo.ts`:
- Automatic batching of requests
- Cache management
- Network error handling
- Local state (if used)

**Queries/Mutations:**
- GraphQL documents in `src/common/gql/`
- Generated types via GraphQL Code Generator (if configured)

### Mantine UI

Global theme setup in `_app.tsx`:
```typescript
<MantineProvider theme={theme}>
  <Component {...pageProps} />
</MantineProvider>
```

Components from `@mantine/core`: Button, Modal, TextField, Loader, etc.

### Rich Text Editing

TipTap v2 for rich text (if used):
```typescript
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
```

## Key Files & Conventions

| File/Directory | Purpose |
|----------------|---------|
| `src/pages/` | Page components (routed) |
| `src/pages/api/` | API routes and GraphQL endpoint |
| `src/common/gql/` | GraphQL queries, mutations, fragments |
| `src/common/constants/` | App-wide constants, enums |
| `src/common/utils/` | Reusable utilities |
| `src/modules/` | Feature-specific code (models, hooks, etc.) |
| `src/apollo.ts` | Apollo Client setup |
| `src/styles/` | Global styles |

## Development Guidelines

### Adding New Features
1. Create page in `src/pages/[feature].tsx`
2. Add GraphQL queries to `src/common/gql/`
3. Create feature module in `src/modules/[feature]/` if complex
4. Use Mantine components for UI
5. Add TypeScript types

### Styling
- Use Mantine's `sx` prop for component styling
- Use Emotion/CSS-in-JS for complex styles
- Global styles in `src/styles/`
- Avoid Tailwind (not in stack)

### State Management
- Local component state with `useState`
- GraphQL cache via Apollo for server state
- Consider Zustand/Jotai for complex client state if needed

## Known Issues & TODOs

- [ ] ESLint v9 compatibility fixes needed (currently on v8)
- [ ] `.workspace/` directory cleanup (build artifacts)
- [ ] pnpm audit issues (run `pnpm audit` to review)
- [ ] Complete GraphQL schema documentation
- [ ] Add integration tests
- [ ] Error boundary implementation
- [ ] Loading state patterns

## Testing

Tests use Vitest (configured in package.json). Test patterns:
```typescript
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';

describe('Component', () => {
  it('should render', () => {
    // test code
  });
});
```

## Environment Variables

None required for local dev. When deploying:
```
NEXT_PUBLIC_API_URL=<graphql-endpoint>
```

## Performance Considerations

- Apollo Client caching reduces API calls
- Next.js automatic code splitting by page
- Image optimization with `next/image`
- Consider SWR or React Query if moving away from Apollo cache
- Monitor bundle size with `next/bundle-analyzer`

## Deployment

```bash
pnpm run build
pnpm run start
```

Deploy to Vercel or self-hosted. Apollo Server runs on `/api/graphql`.

## Next Steps

1. Resolve ESLint v9 compatibility
2. Document GraphQL schema (all types, queries, mutations)
3. Add API route tests
4. Complete Mantine UI theming
5. Set up CI/CD (GitHub Actions)
6. Add integration test suite
