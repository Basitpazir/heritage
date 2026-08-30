const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, trim: true, lowercase: true, index: true },
  excerpt: { type: String, default: '' },
  content: { type: String, default: '' },
  coverImage: { type: String, default: '' },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

// Auto-generate a URL-safe slug from the title if one wasn't provided,
// and keep it unique by appending a short suffix on collision.
blogPostSchema.pre('validate', async function (next) {
  if (this.slug || !this.title) return next();
  const base = this.title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  let candidate = base;
  let suffix = 1;
  const Model = this.constructor;
  while (await Model.exists({ slug: candidate, _id: { $ne: this._id } })) {
    suffix += 1;
    candidate = `${base}-${suffix}`;
  }
  this.slug = candidate;
  next();
});

module.exports = mongoose.model('BlogPost', blogPostSchema);