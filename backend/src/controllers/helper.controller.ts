import { Request, Response } from 'express';
import HelperModel from '../models/helper.model'; // your Mongoose model

export const createHelper = async (req: Request, res: Response) => {
  try {
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };
    const photoUrl = files['photo']?.[0]?.path || null;
    const kycUrl = files['kycDocument']?.[0]?.path || null;
    const additionalUrl = files['additionalDocuments']?.[0]?.path || null;
    const length = await HelperModel.countDocuments({});
    const helper = await HelperModel.create({
      ...req.body,
      employeeId: length + 1,
      photo: photoUrl,
      kycDocument: kycUrl,
      additionalDocuments: additionalUrl,
    });
    res.status(201).json({
        fullName : helper.fullName,
        typeOfService: helper.typeOfService,
        employeeId : helper.employeeId,

    });
  } catch (error) {
    res.status(500).json({ message: 'Upload failed', error });
  }
};

export const getHelpers = async (req: Request, res: Response) => {
    try{
        const {sortBy,searchTerm,service,org} = req.body;
        let filter: any = {};
        if(searchTerm){
          const regex = new RegExp(searchTerm,'i');
          filter.$or = [
              {fullName: regex},
              {employeeId: isNaN(+searchTerm) ? -1 : +searchTerm},
              {phone: regex}
            ]
        }
        if(service?.length > 0){
          filter.typeOfService = { $in: service };
        }
        if(org?.length > 0){
          filter.organizationName = { $in: org }; 
        } 
        let query = HelperModel.find(filter);
        if(sortBy){
          query = query.sort({[sortBy]:1});
        }
        const helpers = await query;
        if(helpers.length === 0 && !searchTerm){
            res.status(404).json({message: 'No helpers found'});
        }else{
            res.status(200).json(helpers);
        }

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
    if(helper){   
      res.status(200).json({message: `Deleted ${helper.fullName}`});   
    }
    else{
      res.status(404).json({message: 'Helper not found'});
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
    };
    const photoUrl = files['photo']?.[0]?.path || null;
    const kycUrl = files['kycDocument']?.[0]?.path || null;
    const additionalUrl = files['additionalDocuments']?.[0]?.path || null;

    const updateData = {
      ...req.body,
      photo: photoUrl,
      kycDocument: kycUrl,
      additionalDocuments: additionalUrl,
    };
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