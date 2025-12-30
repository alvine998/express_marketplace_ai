const { uploadImageToFirebase } = require('../utils/firebaseUtils');
const { logActivity } = require('../utils/loggingUtils');

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    const imageUrl = await uploadImageToFirebase(req.file);
    
    await logActivity(req, 'UPLOAD_IMAGE', { fileName: req.file.originalname });

    res.status(200).json({
      message: 'Upload successful',
      imageUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};
