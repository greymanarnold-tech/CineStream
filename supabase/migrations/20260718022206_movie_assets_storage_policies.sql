/*
# Storage policies for movie-assets bucket

1. Storage
- Public bucket `movie-assets` for movie poster images and video files.
2. Security
- SELECT (read) public so anon + authenticated can stream/view assets.
- INSERT/UPDATE/DELETE restricted to authenticated users (admin uploads).
*/

-- Read access: public
DROP POLICY IF EXISTS "movie_assets_read_public" ON storage.objects;
CREATE POLICY "movie_assets_read_public"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'movie-assets');

-- Insert: authenticated only
DROP POLICY IF EXISTS "movie_assets_insert_auth" ON storage.objects;
CREATE POLICY "movie_assets_insert_auth"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'movie-assets');

-- Update: authenticated only
DROP POLICY IF EXISTS "movie_assets_update_auth" ON storage.objects;
CREATE POLICY "movie_assets_update_auth"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'movie-assets') WITH CHECK (bucket_id = 'movie-assets');

-- Delete: authenticated only
DROP POLICY IF EXISTS "movie_assets_delete_auth" ON storage.objects;
CREATE POLICY "movie_assets_delete_auth"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'movie-assets');
