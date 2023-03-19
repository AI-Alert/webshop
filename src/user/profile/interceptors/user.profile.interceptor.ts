// import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
// import { Observable } from 'rxjs';
// import { FileInterceptor } from "@nestjs/platform-express";
// import { extname } from "path";
// import { diskStorage } from "multer";
//
// @Injectable()
// export class UserProfileInterceptor implements NestInterceptor {
//   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
//     FileInterceptor('image', {
//       storage: diskStorage({
//         destination: './uploads/profile-photos',
//         filename: (req, file, cb) => {
//           const randomName = Array(32)
//             .fill(null)
//             .map(() => Math.round(Math.random() * 16).toString(16))
//             .join('');
//           return cb(null, `${randomName}${extname(file.originalname)}`);
//         },
//       }),
//       fileFilter: (req, file, cb) => {
//         if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
//           return cb(
//             new Error('Only .jpg, .jpeg and .png files are allowed!'),
//             false,
//           );
//         }
//         cb(null, true);
//       },
//     }),
//   }
// }
