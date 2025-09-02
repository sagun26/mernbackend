const multer=require('multer');
const storage=multer.diskStorage({
    destination:(req,file,cb) => {
        const allowedFilesTypes =['image/jpg','image/png','image/jpeg'];
        if(!allowedFilesTypes.includes(file.mimetype)){
            return cb(new Error('File type not allowed'), false);
        }   
        cb(null,'./storage');  //cb(error,success) cb bhitra = error aayo vane k garni success aayo vane k garni 

    },
    filename:(req,file,cb) =>{
        cb(null, Date.now()+"-"+file.originalname)
    }
})
module.exports ={
    multer,
    storage 
}