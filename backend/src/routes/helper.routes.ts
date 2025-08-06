import express from 'express';
import upload from '../middleware/cloudinaryUpload';
import { createHelper, getCount } from '../controllers/helper.controller';
import { getHelpers,getHelperById,deleteHelper,updateHelper} from '../controllers/helper.controller';

const router = express.Router();

router.post(
  '/add',
  upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'kycDocument', maxCount: 1 },
    { name: 'additionalDocuments', maxCount: 1 },
  ]),
  createHelper
);

router.post('/getAll',getHelpers);
router.get('/getCount',getCount);
router.get('/get/:id',getHelperById);
router.delete('/delete/:id', deleteHelper);
router.put('/update/:id',upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'kycDocument', maxCount: 1 },
  { name: 'additionalDocuments', maxCount: 1 },
]), updateHelper);

export default router;
