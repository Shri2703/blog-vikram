const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override'); // Require method-override

const app = express();

// MongoDB Atlas connection URI
const uri = 'mongodb+srv://knvikram2004:BWJ6titnzJSZwb0G@cluster0.us2e3gg.mongodb.net/blog-website';

// MongoDB Atlas connection options
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

// Connect to MongoDB Atlas
mongoose.connect(uri, options)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    
    // Start server only after successful connection
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => console.error('Could not connect to MongoDB Atlas:', err));

// Models
const Post = mongoose.model('Post', { title: String, content: String });

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(methodOverride('_method')); // Use method-override middleware

// Routes
app.get('/', async (req, res) => {
  const posts = await Post.find();
  res.render('index', { posts });
});

app.get('/post/:id', async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.render('post', { post });
});

// DELETE route to handle post deletion
app.delete('/post/:id', async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id); // Delete post from the database
    res.redirect('/'); // Redirect to home page after deletion
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).send('Internal Server Error'); // Handle error
  }
});

app.post('/post', async (req, res) => {
  const { title, content } = req.body;
  const post = new Post({ title, content });
  await post.save();
  res.redirect('/');
});
