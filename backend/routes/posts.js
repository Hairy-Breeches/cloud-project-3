const express = require('express');
const Post = require("../models/posts");
const multer = require('multer');
const s3UploadV2 = require('./s3Service');
const updateS3File = require('./updatesS3File');

const storage = multer.memoryStorage()

const filter = (req, file, cb) => {
  const isValid = MIME_TYPE_MAP[file.mimetype]
  let error = new Error('Invalid mime-type!');

  if(isValid) {
    error = null;
  }

  cb(error, isValid)
}

const upload = multer({storage: storage, fileFilter: filter})

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}

const router = express.Router();


router.post("", upload.single('image'), async (req, res) => {
  const fileName = req.file.originalname.toLowerCase().split(' ').join('-');
  const ext = MIME_TYPE_MAP[req.file.mimetype];

  const file = req.file;
  const result = await s3UploadV2(file, fileName + '-' + Date.now() + '.' + ext)

  console.log('host: ', req.get('host'));

  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: result.Location
  });

  post.save().then(post => {
    res.status(200).json({
      message: "successful posting!",
      post: {
        id: post._id,
        title: post.title,
        content: post.content,
        imagePath: post.imagePath
      },
    });
  });
});

router.get("", (req, res) => {
  Post.find().then((documents) => {
    res.status(200).json({
      message: "Response from the server!",
      posts: documents,
    });
  });

router.get("/:id", (req, res) => {
  Post.findById(req.params.id).then((document) => {
    res.status(200).json({
      message: "successfully fetched the post by ID!",
      post: {
        id: document._id,
        title: document.title,
        content: document.content,
        imagePath: document.imagePath
      },
    });

  });
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;

  Post.deleteOne({ _id: id }).then((result) => {
    res.status(200).json({ message: "post deleted!" });
  });
});

router.put("/:id", upload.single('image'), async (req, res) => {
  let imagePath = req.body.imagePath;

  if(req.file) {
    const fileName = req.file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[req.file.mimetype];

    const file = req.file;
    const result = await s3UploadV2(file, fileName + '-' + Date.now() + '.' + ext)

    imagePath = result.Location;

  } else {
    const imagePath = req.body.imagePath.split('.');
    const ext = imagePath.at(-1);

    const fileName = req.body.title.toLowerCase().split(' ').join('-');

    console.log(fileName + '-' + Date.now() + '.' + ext)
  }

  const currentPost = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath
  });

  currentPost._id = req.params.id;

  Post.updateOne({ _id: req.params.id }, currentPost).then((response) => {
    res.status(200).json({
      message: 'Successfully edited the post!'
    }
    );
  });
});
});


module.exports = router
