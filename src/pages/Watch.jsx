import { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import ShareModal from '../components/ShareModal';

export default function Watch() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { session, user, profile } = useAuth();
  const [movie, setMovie] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [likeState, setLikeState] = useState(0); // 1 like, -1 dislike, 0 none
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data } = await supabase.from('movies').select('*').eq('id', id).maybeSingle();
      setMovie(data);
      if (data) {
        const { data: cmts } = await supabase.from('comments').select('*').eq('movie_id', id).order('created_at', { ascending: false });
        setComments(cmts || []);
      }
      if (session?.user) {
        const { data: like } = await supabase.from('likes').select('*').eq('movie_id', id).eq('user_id', user.id).maybeSingle();
        if (like) setLikeState(like.value);
        const { data: bm } = await supabase.from('bookmarks').select('*').eq('movie_id', id).eq('user_id', user.id).maybeSingle();
        setBookmarked(!!bm);
      }
      setLoading(false);
    }
    load();
  }, [id, session, user]);

  const handleLike = async (value) => {
    if (!session) { navigate('/auth'); return; }
    const newState = likeState === value ? 0 : value;
    setLikeState(newState);
    if (newState === 0) {
      await supabase.from('likes').delete().eq('movie_id', id).eq('user_id', user.id);
    } else {
      await supabase.from('likes').upsert({ movie_id: id, user_id: user.id, value: newState }, { onConflict: 'user_id,movie_id' });
    }
  };

  const handleBookmark = async () => {
    if (!session) { navigate('/auth'); return; }
    if (bookmarked) {
      await supabase.from('bookmarks').delete().eq('movie_id', id).eq('user_id', user.id);
      setBookmarked(false);
    } else {
      const { count } = await supabase.from('bookmarks').select('*', { count: 'exact', head: true }).eq('user_id', user.id);
      await supabase.from('bookmarks').insert({ movie_id: id, user_id: user.id, custom_order: (count || 0) + 1 });
      setBookmarked(true);
    }
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!session) { navigate('/auth'); return; }
    if (!newComment.trim()) return;
    setSubmitting(true);
    const authorName = profile?.full_name || user.email?.split('@')[0] || 'User';
    const { data } = await supabase.from('comments').insert({
      movie_id: id,
      user_id: user.id,
      author_name: authorName,
      content: newComment.trim(),
    }).select().single();
    if (data) setComments([data, ...comments]);
    setNewComment('');
    setSubmitting(false);
  };

  const likeComment = async (commentId, currentLikes) => {
    await supabase.from('comments').update({ likes: currentLikes + 1 }).eq('id', commentId);
    setComments(comments.map((c) => c.id === commentId ? { ...c, likes: c.likes + 1 } : c));
  };

  if (loading) return <div className="loading-center" style={{ paddingTop: 120 }}><div className="spinner" /></div>;
  if (!movie) return <div className="page"><div className="container"><p>Movie not found.</p><Link to="/" className="btn mt-2">Back home</Link></div></div>;

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 1200 }}>
        <div style={{ position: 'relative', width: '100%', marginBottom: 20, borderRadius: 8, overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
          <video
            ref={videoRef}
            className="video-player"
            src={movie.video_url}
            poster={movie.poster_url}
            controls
            autoPlay
            style={{ width: '100%', height: 'auto', background: '#000', aspectRatio: '16/9', display: 'block' }}
          />
        </div>

        <div style={{ marginBottom: 30 }}>
          <h1 style={{ fontSize: '28px', marginBottom: 10 }}>{movie.title}</h1>
          <div style={{ display: 'flex', gap: 15, color: 'var(--text-secondary)', marginBottom: 20, fontSize: 14 }}>
            <span>{movie.year}</span>
            <span>{movie.rating}</span>
            <span>{movie.duration}</span>
            <span>{movie.category}</span>
          </div>

          <div style={{ display: 'flex', gap: 20, marginBottom: 30 }}>
            <button onClick={() => handleLike(1)} className="action-btn" style={actionBtnStyle(likeState === 1)}>
              <i className={likeState === 1 ? 'fas fa-thumbs-up' : 'far fa-thumbs-up'}></i>
              <span>{likeState === 1 ? 'Liked' : 'Like'}</span>
            </button>
            <button onClick={() => handleLike(-1)} className="action-btn" style={actionBtnStyle(likeState === -1)}>
              <i className={likeState === -1 ? 'fas fa-thumbs-down' : 'far fa-thumbs-down'}></i>
              <span>{likeState === -1 ? 'Disliked' : 'Dislike'}</span>
            </button>
            <button onClick={handleBookmark} className="action-btn" style={actionBtnStyle(bookmarked)}>
              <i className={bookmarked ? 'fas fa-bookmark' : 'far fa-bookmark'}></i>
              <span>{bookmarked ? 'Saved' : 'Save'}</span>
            </button>
            <button onClick={() => setShareOpen(true)} className="action-btn" style={actionBtnStyle(false)}>
              <i className="far fa-share-square"></i>
              <span>Share</span>
            </button>
          </div>

          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: 800 }}>{movie.description}</p>
        </div>

        <div style={{ marginTop: 40 }}>
          <h2 className="section-title" style={{ fontSize: 22, marginBottom: 20, paddingBottom: 10, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            Comments ({comments.length})
          </h2>

          <form onSubmit={submitComment} style={{ display: 'flex', gap: 15, marginBottom: 30 }}>
            <input
              type="text"
              className="form-input"
              placeholder={session ? 'Add a comment...' : 'Sign in to comment'}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn" disabled={submitting || !newComment.trim()}>Comment</button>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {comments.length === 0 && <p className="text-secondary">No comments yet. Be the first!</p>}
            {comments.map((c) => (
              <div key={c.id} style={{ display: 'flex', gap: 15 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%', background: 'var(--accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0,
                }}>
                  {c.author_name?.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', marginBottom: 5 }}>
                    {c.author_name} <span style={{ color: 'var(--text-secondary)', fontWeight: 'normal', fontSize: 13 }}>• {new Date(c.created_at).toLocaleDateString()}</span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>{c.content}</p>
                  <div style={{ display: 'flex', gap: 15 }}>
                    <button onClick={() => likeComment(c.id, c.likes)} className="comment-action" style={commentActionStyle}>
                      <i className="far fa-thumbs-up"></i> {c.likes}
                    </button>
                    <button className="comment-action" style={commentActionStyle}><i className="far fa-thumbs-down"></i></button>
                    <button className="comment-action" style={commentActionStyle}>Reply</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} title={movie.title} />
    </div>
  );
}

const actionBtnStyle = (active) => ({
  display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'none', border: 'none',
  color: active ? 'var(--accent)' : 'var(--text)', cursor: 'pointer', transition: 'color 0.3s', fontSize: 14,
});

const commentActionStyle = {
  background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: 13, cursor: 'pointer',
  display: 'flex', alignItems: 'center', gap: 5,
};
