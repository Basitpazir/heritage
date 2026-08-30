import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API = `${import.meta.env.VITE_API_URL}/api`;

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(`${API}/blog`)
      .then(async (r) => {
        if (!r.ok) throw new Error(`Request failed (${r.status})`);
        const data = await r.json();
        if (!Array.isArray(data)) throw new Error('Malformed response');
        return data;
      })
      .then(data => { setPosts(data); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#050506' }}>
      <p className="text-[10px] uppercase tracking-[0.8em] text-white/20 animate-pulse font-display">Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen text-white font-body" style={{ backgroundColor: '#050506' }}>

      {/* Header */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 max-w-[1600px] mx-auto border-b border-white/5">
        <p className="text-[9px] text-white/40 uppercase tracking-[0.5em] mb-3 animate-fade-in">The Journal</p>
        <h1 className="font-display text-3xl sm:text-5xl font-bold uppercase tracking-tight animate-fade-in">Latest Stories</h1>
      </section>

      {/* Grid */}
      <section className="py-12 sm:py-16 px-4 sm:px-8 max-w-[1600px] mx-auto">
        {error ? (
          <div className="text-center py-32">
            <p className="text-[10px] text-white/30 uppercase tracking-widest mb-4">Unable to load stories right now.</p>
            <Link to="/" className="inline-block border border-white/15 text-white/50 hover:text-white hover:border-white/40 px-5 py-2.5 text-[9px] font-bold uppercase tracking-widest transition-all">
              Back to Home
            </Link>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-[10px] text-white/25 uppercase tracking-[0.3em] font-display">No stories published yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <Link key={post._id} to={`/blog/${post.slug}`}
                className="group rounded-3xl overflow-hidden card-lift animate-fade-up"
                style={{ backgroundColor: '#101012', animationDelay: `${Math.min(i, 8) * 0.06}s` }}>
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={post.coverImage} alt={post.title}
                    className="w-full h-full object-cover grayscale group-hover:scale-105 transition-all duration-700" />
                </div>
                <div className="p-5">
                  {post.date && (
                    <p className="text-[8px] text-white/35 uppercase tracking-widest mb-2">
                      {new Date(post.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  )}
                  <h3 className="text-base font-bold text-white mb-2 leading-snug group-hover:underline">{post.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed line-clamp-2">{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Blog;