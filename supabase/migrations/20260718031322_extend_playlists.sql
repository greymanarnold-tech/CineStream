/*
# Extend playlists for user-created content

1. Modified Tables
- `playlists`: add `user_id` (owner), `cover_image_url`, `is_series`, `episode_count`.
- `playlist_movies`: add `episode_number` for series ordering.

2. Security
- Keep public read so anyone can browse playlists.
- Insert/update/delete restricted to authenticated users (owner).
- Add owner-scoped policies using user_id.
*/

ALTER TABLE playlists ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE playlists ADD COLUMN IF NOT EXISTS cover_image_url text;
ALTER TABLE playlists ADD COLUMN IF NOT EXISTS is_series boolean NOT NULL DEFAULT false;
ALTER TABLE playlists ADD COLUMN IF NOT EXISTS episode_count int NOT NULL DEFAULT 0;

ALTER TABLE playlist_movies ADD COLUMN IF NOT EXISTS episode_number int;

-- Replace policies with owner-scoped versions (keep public read)
DROP POLICY IF EXISTS "playlists_insert_auth" ON playlists;
CREATE POLICY "playlists_insert_auth" ON playlists FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "playlists_update_auth" ON playlists;
CREATE POLICY "playlists_update_auth" ON playlists FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "playlists_delete_auth" ON playlists;
CREATE POLICY "playlists_delete_auth" ON playlists FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_playlists_user ON playlists(user_id);
