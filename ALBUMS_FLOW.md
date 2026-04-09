# `/albums` Frontend Flow

This file explains what happens when a user opens `/albums`, using the actual frontend code.

## Step 1. Router matches `/albums`

- File: `src/App.tsx`
- Component: `App`
- Approx lines: `11-18`

```tsx
<Routes>
    <Route path="/login" element={<LoginPage />} />

    <Route element={<ProtectedRoute />}>
        <Route path="/albums" element={<AlbumsPage />} />
        <Route path="/playlists" element={<PlaylistsPage />} />
        <Route path="/customers" element={<CustomersPage />} />
    </Route>
</Routes>
```

What happens:

- React Router sees the `/albums` URL.
- The route is inside `<ProtectedRoute />`, so the app checks authentication first.
- If access is allowed, `AlbumsPage` will be shown.

## Step 2. Protected route checks the token

- File: `src/components/ProtectedRoute.tsx`
- Component: `ProtectedRoute`
- Approx lines: `6-18`

```tsx
const ProtectedRoute = () => {
    const token = useAuthStore((s) => s.token);

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return (
        <>
            <NavBar />
            <Outlet />
        </>
    );
};
```

What happens:

- `ProtectedRoute` reads `token` from Zustand store.
- If there is no token, the user is redirected to `/login`.
- If token exists, the layout is rendered and `<Outlet />` shows `AlbumsPage`.

## Step 3. Albums page starts the albums query

- File: `src/components/pages/AlbumsPage.tsx`
- Component: `AlbumsPage`
- Approx lines: `36-45`

```tsx
const AlbumsPage = () => {
    const role = useAuthStore(s => s.role);
    const canViewAlbums = role === "USER" || role === "SUPER_USER";

    const { data: albums = [], isPending, error } = useQuery<Album[]>({
        queryKey: ["albums"],
        queryFn: fetchAlbums,
        enabled: canViewAlbums,
    });}
```

What happens:

- `AlbumsPage` reads the user role from Zustand.
- It allows the albums request only for `USER` and `SUPER_USER`.
- React Query runs `fetchAlbums`.

## Step 4. Albums page blocks wrong roles and handles loading state

- File: `src/components/pages/AlbumsPage.tsx`
- Component: `AlbumsPage`
- Approx lines: `47-51`

```tsx
if (!canViewAlbums) return <Navigate to="/customers" replace />;

if (isPending) return <Center h="100vh"><Spinner size="xl" color="purple.500" /></Center>;
if (error) return <Center h="100vh"><Text color="red.400">Failed to load albums.</Text></Center>;
```

What happens:

- If the role is not allowed, the user is redirected to `/customers`.
- While data is loading, a spinner is shown.
- If the request fails, an error message is shown.

## Step 5. `fetchAlbums` sends the request through the shared API client

- File: `src/services/albums-service.ts`
- Function: `fetchAlbums`
- Approx lines: `9-12`

```ts
export const fetchAlbums = async (): Promise<Album[]> => {
    const response = await apiClient.get<Album[]>("/albums");
    return response.data;
};
```

What happens:

- `fetchAlbums` calls `apiClient.get("/albums")`.
- This is the place where the albums request is started.
- It returns only `response.data` back to React Query.

## Step 6. Axios client knows the backend base URL

- File: `src/services/api-client.ts`
- Variable: `apiClient`
- Approx lines: `4-6`

```ts
export const apiClient = axios.create({
    baseURL: "http://localhost:3000",
});
```

What happens:

- Axios uses `http://localhost:3000` as the backend base URL.
- Because of that, `"/albums"` becomes a request to `http://localhost:3000/albums`.

## Step 7. The token is taken from Zustand and added in the request interceptor

- File: `src/services/api-client.ts`
- Code: request interceptor
- Approx lines: `29-44`

```ts
apiClient.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(`[API] Sending ${method} request to ${url}`, {
        params: sanitizeForLog(config.params),
        data: sanitizeForLog(config.data),
    });

    return config;
});
```

What happens:

- The token is taken from Zustand here: `useAuthStore.getState().token`.
- Before the request is sent, the interceptor adds `Authorization: Bearer <token>`.
- The same interceptor also logs the request.

## Step 8. Axios receives the response and logs it

- File: `src/services/api-client.ts`
- Code: response interceptor
- Approx lines: `50-56`

```ts
apiClient.interceptors.response.use((response) => {
    console.log(`[API] Response received from ${method} ${url}:`, sanitizeForLog(response.data));
    return response;
});
```

What happens:

- After the backend responds, Axios logs the returned data.
- Then the full response goes back to `fetchAlbums`.
- `fetchAlbums` returns `response.data` to React Query.

## Step 9. Albums page receives the data and renders the table

- File: `src/components/pages/AlbumsPage.tsx`
- Component: `AlbumsPage`
- Approx lines: `53-68`

```tsx
<DataTable
    data={albums}
    columns={albumColumns}
    getRowKey={(album) => album.id}
    onRowClick={setSelectedAlbum}
    pageSize={10}
/>
```

What happens:

- When React Query finishes successfully, `albums` contains the returned data.
- `AlbumsPage` passes that data into `DataTable`.
- The user now sees the albums list on the screen.

## Short summary

1. `App.tsx` matches `/albums`.
2. `ProtectedRoute.tsx` checks the token from Zustand.
3. `AlbumsPage.tsx` starts `useQuery`.
4. `albums-service.ts` sends `GET /albums`.
5. `api-client.ts` adds the Bearer token in the interceptor.
6. Axios sends the request to `http://localhost:3000/albums`.
7. Axios logs the response and returns data.
8. `AlbumsPage.tsx` renders the albums table.
