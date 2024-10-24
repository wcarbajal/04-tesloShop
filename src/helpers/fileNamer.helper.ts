import { v4 as uuid } from "uuid";

export const fileNamer = ( req: Express.Request, file: Express.Multer.File, callback: Function ) => {



  if ( !file ) return callback( new Error( 'File is empty' ), false );
  const ext = file.mimetype.split( '/' )[ 1 ];
  const fecha = new Date().getTimezoneOffset();
  console.log( fecha );
  /* const nombre = file.originalname.split( '.' )[0]


  const fileName = `${nombre}.${ext}`; */
  callback( null, `${ uuid() }.${ ext }` );




  //callback(null, fileName);
}

