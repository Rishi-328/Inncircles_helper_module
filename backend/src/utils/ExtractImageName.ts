export const getImageName = (url: string): string => { 
    const parts = url.split('/');
    const Image = parts[parts.length - 1];
    const ImageName = Image.split('.')[0];
    return ImageName;
}
