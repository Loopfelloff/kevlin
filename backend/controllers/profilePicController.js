const User = require("../models/userModel");
const uploadToCloudinary = require("../config/uploadCloudinaryConfig");
const handleProfilePic = async (req, res) => {
  try {
    if (!req?.files || !req?.files?.profilePicture) {
      return res.status(400).json({
        error: "No file uploaded",
      });
    }
    const file = req.files.profilePicture[0];

    const publicId = `${Date.now()}-${file.originalname.replace(/\.[^/.]+$/, "")}`;
    const result = await uploadToCloudinary(file.buffer, {
      public_id: publicId,
      folder: "uploads",
      resource_type: "auto",
    });
    const user = await User.findOne({ email: req.user.email }).exec();
    if (!user) return res.status(401).json({ error: "bad email recieved" });
    user.profileImageUrl = result.secure_url
    await user.save()
    return res.status(200).json({msg : 'successful upload' , url : result.secure_url})
  } catch (err) {
    console.error("Upload error: ", err);
    res.status(500).json({ error: err.message });
  }
};
module.exports = {handleProfilePic};
