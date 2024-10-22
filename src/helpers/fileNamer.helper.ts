export const fileNamer = ( req: Express.Request, file: Express.Multer.File, callback: Function ) => {

  

  if( !file) return callback( new Error( 'File is empty' ), false );

  const ext = file.mimetype.split( '/' )[1];

  const fileName = `HolaMundo.${ext}  `;
  //callback( null, `${Date.now()}-${file.originalname.split( '.' )[0]}.${ext}`);




  callback(null, fileName);
}

