const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: "dinvkvrug" || process.env.CLOUD_NAME,
    api_key: "399824364793338" || process.env.CLOUD_API_KEY,
    api_secret: "c2nvh14c_AxVmRdVqfAz7AKUaWA" || process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'GetGeeks',
        allowedFormats: ['jpeg', 'png', 'jpg']
    }
});

module.exports = {
    cloudinary,
    storage
}