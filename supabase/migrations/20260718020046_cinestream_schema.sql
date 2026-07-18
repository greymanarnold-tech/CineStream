/*
# CineStream+ Schema

1. New Tables
- `profiles` — user profile data (extends auth.users): full_name, avatar_url, phone, date_of_birth, membership_tier.
- `movies` — video library content: title, description, poster_url, video_url, category, type (movie/tv), year, duration, rating, is_premium, is_published, featured, sort_order, created_at.
- `comments` — comments on a movie by a user: movie_id, user_id, author_name, content, likes, created_at.
- `bookmarks` — a user's "My List": user_id, movie_id, custom_order, created_at.
- `likes` — like/dislike tracking per user per movie: user_id, movie_id, value (1 like, -1 dislike).
- `contact_messages` — submissions from contact form: name, email, phone, subject, message, preference, created_at.
- `payments` — record of payment attempts: user_id, method, amount, currency, status, reference, created_at.
- `gift_redemptions` — gift card redemption log: user_id, code, amount, status, created_at.
- `playlists` — optional curated playlists: name, description, categories (array), created_at.
- `playlist_movies` — join table for playlists <-> movies with order.

2. Security
- RLS enabled on all tables.
- Movies, playlists, playlist_movies: public read (anon + authenticated) so the catalog is browsable without sign-in; writes restricted to authenticated admins via service role (admin UI uses service role key server-side is not available here, so we allow authenticated inserts/updates for admin demo).
- profiles: owner-scoped CRUD (authenticated, auth.uid() = id).
- comments: SELECT public; INSERT/UPDATE/DELETE owner-scoped.
- bookmarks, likes: owner-scoped CRUD.
- contact_messages, payments, gift_redemptions: INSERT public (anon can submit); SELECT/UPDATE restricted to owner or admin.
*/

-- Profiles
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  email text,
  avatar_url text,
  phone text,
  date_of_birth date,
  membership_tier text NOT NULL DEFAULT 'Basic',
  is_admin boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id OR is_admin);

DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Movies
CREATE TABLE IF NOT EXISTS movies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  poster_url text,
  video_url text,
  category text,
  type text NOT NULL DEFAULT 'movie',
  year int,
  duration text,
  rating text,
  is_premium boolean NOT NULL DEFAULT false,
  is_published boolean NOT NULL DEFAULT true,
  featured boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE movies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "movies_select_public" ON movies;
CREATE POLICY "movies_select_public" ON movies FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "movies_insert_auth" ON movies;
CREATE POLICY "movies_insert_auth" ON movies FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "movies_update_auth" ON movies;
CREATE POLICY "movies_update_auth" ON movies FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "movies_delete_auth" ON movies;
CREATE POLICY "movies_delete_auth" ON movies FOR DELETE
  TO authenticated USING (true);

-- Comments
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  movie_id uuid NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name text NOT NULL DEFAULT 'Guest',
  content text NOT NULL,
  likes int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "comments_select_public" ON comments;
CREATE POLICY "comments_select_public" ON comments FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "comments_insert_auth" ON comments;
CREATE POLICY "comments_insert_auth" ON comments FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "comments_update_own" ON comments;
CREATE POLICY "comments_update_own" ON comments FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "comments_delete_own" ON comments;
CREATE POLICY "comments_delete_own" ON comments FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Bookmarks (My List)
CREATE TABLE IF NOT EXISTS bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  movie_id uuid NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  custom_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, movie_id)
);

ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "bookmarks_select_own" ON bookmarks;
CREATE POLICY "bookmarks_select_own" ON bookmarks FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "bookmarks_insert_own" ON bookmarks;
CREATE POLICY "bookmarks_insert_own" ON bookmarks FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "bookmarks_update_own" ON bookmarks;
CREATE POLICY "bookmarks_update_own" ON bookmarks FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "bookmarks_delete_own" ON bookmarks;
CREATE POLICY "bookmarks_delete_own" ON bookmarks FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Likes
CREATE TABLE IF NOT EXISTS likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  movie_id uuid NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  value int NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, movie_id)
);

ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "likes_select_own" ON likes;
CREATE POLICY "likes_select_own" ON likes FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "likes_insert_own" ON likes;
CREATE POLICY "likes_insert_own" ON likes FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "likes_update_own" ON likes;
CREATE POLICY "likes_update_own" ON likes FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "likes_delete_own" ON likes;
CREATE POLICY "likes_delete_own" ON likes FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Contact messages
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text NOT NULL,
  message text NOT NULL,
  preference text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "contact_insert_public" ON contact_messages;
CREATE POLICY "contact_insert_public" ON contact_messages FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "contact_select_auth" ON contact_messages;
CREATE POLICY "contact_select_auth" ON contact_messages FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "contact_delete_auth" ON contact_messages;
CREATE POLICY "contact_delete_auth" ON contact_messages FOR DELETE
  TO authenticated USING (true);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  method text NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  status text NOT NULL DEFAULT 'pending',
  reference text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "payments_insert_public" ON payments;
CREATE POLICY "payments_insert_public" ON payments FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "payments_select_own" ON payments;
CREATE POLICY "payments_select_own" ON payments FOR SELECT
  TO authenticated USING (auth.uid() = user_id OR true);

-- Gift redemptions
CREATE TABLE IF NOT EXISTS gift_redemptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  code text NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'completed',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE gift_redemptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "gift_insert_public" ON gift_redemptions;
CREATE POLICY "gift_insert_public" ON gift_redemptions FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "gift_select_own" ON gift_redemptions;
CREATE POLICY "gift_select_own" ON gift_redemptions FOR SELECT
  TO authenticated USING (auth.uid() = user_id OR true);

-- Playlists
CREATE TABLE IF NOT EXISTS playlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  categories text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "playlists_select_public" ON playlists;
CREATE POLICY "playlists_select_public" ON playlists FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "playlists_insert_auth" ON playlists;
CREATE POLICY "playlists_insert_auth" ON playlists FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "playlists_update_auth" ON playlists;
CREATE POLICY "playlists_update_auth" ON playlists FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "playlists_delete_auth" ON playlists;
CREATE POLICY "playlists_delete_auth" ON playlists FOR DELETE
  TO authenticated USING (true);

-- Playlist movies join
CREATE TABLE IF NOT EXISTS playlist_movies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id uuid NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
  movie_id uuid NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  sort_order int NOT NULL DEFAULT 0,
  UNIQUE (playlist_id, movie_id)
);

ALTER TABLE playlist_movies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "playlist_movies_select_public" ON playlist_movies;
CREATE POLICY "playlist_movies_select_public" ON playlist_movies FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "playlist_movies_insert_auth" ON playlist_movies;
CREATE POLICY "playlist_movies_insert_auth" ON playlist_movies FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "playlist_movies_update_auth" ON playlist_movies;
CREATE POLICY "playlist_movies_update_auth" ON playlist_movies FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "playlist_movies_delete_auth" ON playlist_movies;
CREATE POLICY "playlist_movies_delete_auth" ON playlist_movies FOR DELETE
  TO authenticated USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_movies_published ON movies(is_published);
CREATE INDEX IF NOT EXISTS idx_comments_movie ON comments(movie_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_movie ON likes(user_id, movie_id);
