import { v2 as cloudinary } from "cloudinary";

async function initCloudinary() {
  try {
    // Initialize Cloudinary
    const config = {
      cloud_name: import.meta.env.CLOUDINARY_NAME,
      api_key: import.meta.env.CLOUDINARY_API_KEY,
      api_secret: import.meta.env.CLOUDINARY_API_SECRET,
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
