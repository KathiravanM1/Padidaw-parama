import AlumniPost from '../models/AlumniPost.js';

export const getAllPosts = async (req, res) => {
  try {
    const { type } = req.query;
    const filter = type ? { type } : {};
    const posts = await AlumniPost.find(filter)
      .populate('author', 'firstName lastName linkedinUrl githubUrl')
      .sort({ createdAt: -1 });
    res.json({ posts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createPost = async (req, res) => {
  try {
    const { type, title, content, company, role, package: pkg, location, applyLink } = req.body;

    const postData = {
      author: req.user._id,
      type,
      title,
      content,
      company,
      role,
      package: pkg,
      location,
      applyLink,
    };

    if (req.file) {
      postData.fileUrl = req.file.location;
      postData.fileName = req.file.originalname;
    }

    const post = await AlumniPost.create(postData);
    await post.populate('author', 'firstName lastName linkedinUrl githubUrl');
    res.status(201).json({ message: 'Post created successfully', post });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await AlumniPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const isOwner = post.author.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized' });

    await post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
