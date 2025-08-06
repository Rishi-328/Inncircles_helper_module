import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary';


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => ({
        folder: 'helper_upload',
        public_id: `${file.fieldname}-${Date.now()}`,
        resource_type: 'image'
    

    })
})

const upload = multer({ storage: storage});
export default upload;
function isPDF(file: Express.Multer.File) {
    throw new Error('Function not implemented.');
}

