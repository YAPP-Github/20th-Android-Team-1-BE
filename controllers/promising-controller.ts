import PromisingService from '../services/promising-service';
import { Controller, Post, Res, Req, UseBefore } from 'routing-controllers';
import { Request, Response } from 'express';
import { BadRequestError } from 'routing-controllers';
import arrayUtil from '../utils/array';
import bodyParser from 'body-parser';
import { UserAuthMiddleware } from '../middlewares/auth';

@Controller()
@UseBefore(bodyParser())
@UseBefore(UserAuthMiddleware)
export class PromisingController {
  @Post('/promisings')
  async create(@Req() req: Request, @Res() res: Response) {
    try {
      const requireList = ['promisingName', 'ownerId', 'categoryId', 'minTime', 'maxTime'];
      const promisingInfo = req.body;

      const isValid = await arrayUtil.paramValidation(promisingInfo, requireList);
      if (!isValid) return new BadRequestError('invalid param');

      const promising = await PromisingService.create(promisingInfo);
      return res.status(200).send(promising);
    } catch (err: any) {
      return err;
    }
  }
}
