import PromisingService from '../services/promising-service';
import { JsonController, Param, Body, Get, Post, Put, Delete, Res, Req, UseBefore } from 'routing-controllers';
import { SignUpMiddleware } from '../middlewares/auth';
import { PromisingResponse } from '../dtos/promising/response';
import { PromisingRequest } from '../dtos/promising/request';
import { Response } from 'express';
import PromisingModel from '../models/promising';


@JsonController()
export class PromisingController {
    @Post('/promisings')
    @UseBefore(SignUpMiddleware)
    async create(@Body() req: PromisingRequest, @Res() res: Response) {
        try {
            const promisingResponse: PromisingModel | any = await PromisingService.create(req)
            return res.status(200).send(promisingResponse)
        } catch (err: any) {
            return err
        }
    }
}
