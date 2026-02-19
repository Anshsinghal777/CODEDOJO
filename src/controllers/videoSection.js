import { v2 as cloudinary } from 'cloudinary';
import Problem from "../models/problem.js";
import User from '../models/user.js';
import  SolutionVideo from "../models/solutionVideo.js";
// const { sanitizeFilter } = require('mongoose');


cloudinary.config({
  cloud_name: 'dqgjbq3sr',
  api_key: '352436483858767', 
  api_secret: "5fmb5ouc1d8MWg5Q9HETpugTP3c"
});

const generateUploadSignature = async (req, res) => {
  try {
    const { problemId } = req.params;
    
    const userId = req.result._id;
    // Verify problem exists
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    // Generate unique public_id for the video
    const timestamp = Math.round(new Date().getTime() / 1000);
    const publicId = `codedojo-solutions/${problemId}/${userId}_${timestamp}`;
    
    // Upload parameters
    const uploadParams = {
      timestamp: timestamp,
      public_id: publicId,
    };

    // Generate signature
    const signature = cloudinary.utils.api_sign_request(
      uploadParams,
     "5fmb5ouc1d8MWg5Q9HETpugTP3c"
    );

    res.json({
      signature,
      timestamp,
      public_id: publicId,
      api_key: '352436483858767',
      cloud_name: 'dqgjbq3sr',
      upload_url: "https://api.cloudinary.com/dqgjbq3sr/video/upload",
    });

  } catch (error) {
    console.error('Error generating upload signature:', error);
    res.status(500).json({ error: 'Failed to generate upload credentials' });
  }
};


const saveVideoMetadata = async (req, res) => {
  try {
    const {
      problemId,
      cloudinaryPublicId,
      secureUrl,
      duration,
    } = req.body;

    const userId = req.result._id;

    // Verify the upload with Cloudinary
    const cloudinaryResource = await cloudinary.api.resource(
      cloudinaryPublicId,
      { resource_type: 'video' }
    );

    if (!cloudinaryResource) {
      return res.status(400).json({ error: 'Video not found on Cloudinary' });
    }

    // Check if video already exists for this problem and user
    const existingVideo = await SolutionVideo.findOne({
      problemId,
      userId,
      cloudinaryPublicId
    });

    if (existingVideo) {
      return res.status(409).json({ error: 'Video already exists' });
    }

    const thumbnailUrl = cloudinary.url(cloudinaryResource.public_id, {
    resource_type: 'image',  
    transformation: [
    { width: 400, height: 225, crop: 'fill' },
    { quality: 'auto' },
    { start_offset: 'auto' }  
    ],
    format: 'jpg'
    });

    // Create video solution record
    const videoSolution = new SolutionVideo({
      problemId,
      userId,
      cloudinaryPublicId,
      secureUrl,
      duration: cloudinaryResource.duration || duration,
      thumbnailUrl
    });

    await SolutionVideo.save();


    res.status(201).json({
      message: 'Video solution saved successfully',
      videoSolution: {
        id: SolutionVideo._id,
        thumbnailUrl: SolutionVideo.thumbnailUrl,
        duration: SolutionVideo.duration,
        uploadedAt: SolutionVideo.createdAt
      }
    });

  } catch (error) {
    console.error('Error saving video metadata:', error);
    res.status(500).json({ error: 'Failed to save video metadata' });
  }
};


const deleteVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.result._id;

    const video = await SolutionVideo.findByIdAndDelete(videoId);
    
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    await cloudinary.uploader.destroy(video.cloudinaryPublicId, { resource_type: 'video' , invalidate: true });

    res.json({ message: 'Video deleted successfully' });

  } catch (error) {
    console.error('Error deleting video:', error);
    res.status(500).json({ error: 'Failed to delete video' });
  }
};

export { generateUploadSignature, saveVideoMetadata, deleteVideo };