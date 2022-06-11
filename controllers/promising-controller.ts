import PromisingService from '../services/promising-service';
import { Request, Response } from 'express';
import { Controller, Param, Body, Get, Post, Put, Delete, Res, Req, UseBefore } from 'routing-controllers';
import bodyParser from 'body-parser';


@Controller()
@UseBefore(bodyParser())
export class PromisingController {
    @Post('/promisings')
    async create(@Req() req: Request, @Res() res: Response) {
        let resJson = {}
        try {
            resJson = await PromisingService.create(req, res)
            return resJson
        } catch (err: any) {
            return err
        }
    }
}

