import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const API = `${import.meta.env.VITE_API_URL}/api`;

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setPost(null);
    window.scrollTo(0, 0);
    fetch(`${API}/blog/${slug}`)
      .then(async (r) => {
        if (!r.ok) throw new Error(`Request failed (${r.status})`);
        const data = await r.json();
        if (!data || typeof data !== 'object' || !data._id) throw new Error('Malformed response');
        return data;
      })
      .then(data => { setPost(data); setLoading(false); })
      .catch(() => { setPost(null); setLoading(false); });
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#050506' }}>
      <p className="text-[10px] uppercase tracking-[0.8em] text-white/20 animate-pulse font-display">Loading...</p>
    </div>
  );

  if (!post) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center" style={{ backgroundColor: '#050506' }}>
      <p className="text-[10px] uppercase tracking-widest text-white/30">Story not found.</p>
      <Link to="/blog" className="mt-2 border border-white/15 text-white/50 hover:text-white hover:border-white/40 px-5 py-2.5 text-[9px] font-bold uppercase tracking-widest transition-all">
        Back to Journal
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen text-white font-body" style={{ backgroundColor: '#050506' }}>

      {/* Breadcrumb */}
      <div className="border-b border-white/5 px-4 sm:px-8 lg:px-12 py-4 overflow-x-auto">
        <div className="max-w-[900px] mx-auto flex gap-3 text-[8px] uppercase tracking-widest text-white/25 whitespace-nowrap">
          <Link to="/" className="hover:text-white/50 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-white/50 transition-colors">Journal</Link>
          <span>/</span>
          <span className="text-white/45">{post.title}</span>
        </div>
      </div>

      {/* Cover image */}
      {post.coverImage && (
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 pt-10 sm:pt-16">
          <div className="aspect-[16/9] rounded-2xl overflow-hidden animate-fade-up">
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover grayscale" />
          </div>
        </div>
      )}

      {/* Content */}
      <article className="max-w-[720px] mx-auto px-4 sm:px-8 py-10 sm:py-16">
        {post.date && (
          <p className="text-[9px] text-white/40 uppercase tracking-[0.3em] mb-4 animate-fade-in">
            {new Date(post.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        )}
        <h1 className="font-display text-2xl sm:text-4xl font-bold uppercase tracking-tight leading-tight mb-8 animate-fade-in">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="text-white/60 text-base leading-relaxed mb-8 border-l border-white/15 pl-5">
            {post.excerpt}
          </p>
        )}

        {post.content && (
          <div className="text-white/70 text-[15px] leading-loose whitespace-pre-line">
            {post.content}
          </div>
        )}

        <div className="mt-16 pt-8 border-t border-white/5">
          <Link to="/blog" className="inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.3em] text-white/50 hover:text-white transition-colors">
            ← Back to Journal
          </Link>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;