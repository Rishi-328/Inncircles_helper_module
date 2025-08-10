import qrcode from 'qrcode';

const generateQrCode = async(employeeId: number,fullName: string,typeOfService: string) =>{
    try{
        const qrCodeUrl = await qrcode.toDataURL(employeeId.toString(),);
        return qrCodeUrl;
    }catch(error){
        throw new Error('Failed to generate QR code');
    }

}
export default generateQrCode;