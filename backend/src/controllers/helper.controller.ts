import  { Request, Response } from 'express';
import HelperModel from '../models/helper.model'; 
import {getImageName }from '../utils/ExtractImageName';
import {deleteImage, uploadImage} from '../utils/cloudinary.utils'; 
import { getNextId } from '../utils/getNextId';
import generateQrCode from '../utils/qrcode';

export const createHelper = async (req: Request, res: Response) => {
  let cleanUpUrls: string[] = [];
  try {
    const files = req.files as {
      [fiedname: string]: Express.Multer.File[];
    }
    const fileNames = ['photo','kycDocument','additionalDocuments'];
    for(const field of fileNames){
      const file = files?.[field]?.[0];
      if(file){
        const public_id = `${field}-${Date.now()}`;
        const result = await uploadImage(file,public_id);
        req.body[field] = result.secure_url;
        cleanUpUrls.push(public_id);
      }
    }
    await getNextId('employeeId')
      .then((id)=>{
        req.body.employeeId = id;
      })
      .catch(error =>{
        console.error('Error in generating employeeId: ',error);
      })
    const newHelper = new HelperModel(req.body);
    const qrCodeUrl = await generateQrCode(newHelper.employeeId,newHelper.fullName,newHelper.typeOfService);
    newHelper.qrCode = qrCodeUrl;
    await newHelper.save();

    res.status(201).json(newHelper);
  } catch (error) {
    res.status(500).json({ message: 'Upload failed', error });
    for(const public_id of cleanUpUrls){
      deleteImage(public_id);
    }

  }
};

export const getHelpers = async (req: Request, res: Response) => {
    try{
        const {sortBy,searchTerm,service,org} = req.body;
        let filter: any = {};
        if(searchTerm){
          const safeSearch = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const regex = new RegExp(safeSearch,'i');
          filter.$or = [
              {fullName: regex},
              {employeeId: isNaN(+safeSearch) ? -1 : +safeSearch},
              {phone: regex}
            ]
        }
        if(service?.length > 0){
          filter.typeOfService = { $in: service };
        }
        if(org?.length > 0){
          filter.organizationName = { $in: org }; 
        } 
        console.log(filter);
        let query = HelperModel.find(filter);
        if(sortBy){
          query = query.collation({ locale: "en", strength: 2 }).sort({[sortBy]:1});
        }
        const helpers = await query;
        console.log(helpers);
        res.status(200).json(helpers);

    }catch(error){
        res.status(500).json({message: 'Failed to get helpers', error});
    }
}

export const getCount = async (req: Request, res: Response)=>{
  try{
    const length = await HelperModel.countDocuments({});
    res.status(200).json({count: length});
  }catch(error){
    res.status(500).json({message:'Failed to get count',error});
  }
  
}

export const getHelperById = async (req: Request, res: Response) => {
  try {
    const {id} = req.params;
    const helper = await HelperModel.findOne({employeeId: id});
    if (helper) {
      res.status(200).json(helper);
    }else{
      res.status(404).json({ message: 'Helper not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to get helper', error });
  }
};

export const deleteHelper = async (req: Request, res: Response)=>{
  try{
    const {id} = req.params;
    const helper = await HelperModel.findOneAndDelete({employeeId: +id});
    if(!helper){
      return res.status(404).json({message: 'Helper not found'});
    }
    if(helper.photo){
      const photoName = getImageName(helper.photo);
      deleteImage(photoName);
    }
    if(helper.kycDocument){
      const kycName = getImageName(helper.kycDocument);
      deleteImage(kycName);
    } 
    if(helper.additionalDocuments){
      const additionalName = getImageName(helper.additionalDocuments);
      deleteImage(additionalName);
    }  
    
    if(helper){   
      res.status(200).json({message: `Deleted ${helper.fullName}`});   
    }
  }catch(error){
    res.status(500).json({message: 'Failed to delete helper', error});
  }
}

export const updateHelper = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    }
    const updateData = {...req.body};
    const fileNames = ['photo', 'kycDocument', 'additionalDocuments'];
    for(const field of fileNames){
      const file = files?.[field]?.[0];
      if(file){
        const data = await HelperModel.findOne<{[key:string]:string}>({employeeId: +id},{_id : 0, [field]: 1});
        if (data?.[field]) {
          deleteImage(getImageName(data[field])); 
        }
        const public_id = `${field}-${Date.now()}`;
        const result = await uploadImage(file,public_id);
        updateData[field] = result.secure_url;
      }else{
        if(req.body[field]){
          updateData[field] = req.body[field];
        }
      }

    }
    const helper = await HelperModel.findOneAndUpdate({ employeeId: +id },updateData,{ new: true });
    if (helper) {
      res.status(200).json({ message: 'Changes Saved!'});
    } else {
      res.status(404).json({ message: 'Helper not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to update helper', error });
  }
}