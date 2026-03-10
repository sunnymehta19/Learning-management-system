const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const generateSignedVideoUrl = (publicId) => {
  const expiresAt = Math.floor(Date.now() / 1000) + 7200;

  const signedUrl = cloudinary.utils.url(publicId, {
    resource_type: "video",
    type: "authenticated",
    sign_url: true,
    expires_at: expiresAt,
    secure: true,
  });

  return signedUrl;
};

module.exports = generateSignedVideoUrl;