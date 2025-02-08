import { v2 as cloudinary } from "cloudinary";

async function initCloudinary() {
  try {
    const CLOUDINARY_NAME = import.meta.env.CLOUDINARY_NAME;
    const CLOUDINARY_API_KEY = import.meta.env.CLOUDINARY_API_KEY;
    const CLOUDINARY_API_SECRET = import.meta.env.CLOUDINARY_API_SECRET;

    if (!CLOUDINARY_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
      throw new Error("Cloudinary credentials are missing");
    }

    // Initialize Cloudinary
    const config = {
      cloud_name: CLOUDINARY_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
    };
    cloudinary.config(config);

    // Verify connection
    await cloudinary.api.ping();
    console.log("Cloudinary connected successfully");
    return cloudinary;
  } catch (error) {
    console.error("Cloudinary initialization failed:", error);
    throw error;
  }
}

const cloudinaryInstance = await initCloudinary();
export default cloudinaryInstance;
