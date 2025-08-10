import Counter from '../models/counter.model';
export const getNextId = async(name: string): Promise<number> => {
    const counterIncrement = await Counter.findByIdAndUpdate({_id:name},{$inc:{sequence:1}},{new:true,upsert:true});
    return counterIncrement.sequence;
}