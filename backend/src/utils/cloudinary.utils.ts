import cloudinary from '../config/cloudinary';
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

export const uploadImage = (file: Express.Multer.File,public_id: string): Promise<any> =>{
    return new Promise((resolve,reject)=>{
        cloudinary.uploader.upload_stream({
            folder: 'helper_upload',
            resource_type: 'image',
            public_id: public_id
        },
        (error,result)=>{
            if(error)reject(error);
            resolve(result);
        }
        ).end(file.buffer);
    })
}