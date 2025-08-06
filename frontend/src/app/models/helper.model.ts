import { Language } from "./language.model";
export interface HelperUser {
    employeeId: number;
    photo: File | string;
    typeOfService: string;
    organizationName: string;
    fullName: string;
    languages: string[];    
    gender:string;
    phone: string;
    email: string;
    vehicleType: string[];
    kycDocument: File;
    kycDocumentType: string;
    additionalDocuments: File;
    joinedOn: string;
}
export const serviceTypes = ['Maid','Cook','Nurse','Driver'];
export const Organization = ['ASBL', 'Springs Helpers'];
export const vehicleTypes = ['Auto', 'Bike', 'Car', 'None']

export const iconMap : {[key : string] : string} = {
    'Maid': 'cleaning_services',
    'Cook': 'restaurant',
    'Nurse': 'local_hospital',
    'Driver': 'drive_eta'
  }
   
export const languages: Language[] = [
    { value: 'English', label: 'English' },
    { value: 'Hindi', label: 'Hindi' },
    { value: 'Telugu', label: 'Telugu' },
    { value: 'Tamil', label: 'Tamil' },
    { value: 'Kannada', label: 'Kannada' },
    { value: 'Malayalam', label: 'Malayalam' },
];