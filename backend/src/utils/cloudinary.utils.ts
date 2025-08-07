import {v2 as cloudinary} from 'cloudinary';

export const deleteImage = (imageName: string) =>{
    imageName = 'helper_upload/'+ imageName;
    cloudinary.uploader.destroy(imageName)
       .then((result)=>{
        console.log('Image deleted successfully:', result);
       })
       .catch((error)=>{
        console.error('Error deleting image:', error);
       })
}


