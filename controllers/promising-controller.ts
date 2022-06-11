import PromisingService from '../services/promising-service';
import { Controller, Param, Body, Get, Post, Put, Delete, Res, Req, UseBefore } from 'routing-controllers';
import bodyParser from 'body-parser';


@Controller()
@UseBefore(bodyParser())
export class PromisingController {
    @Post('/promisings')
    async create(@Body() body: any) {
        let resJson = {}
        try {
            resJson = await PromisingService.create(body)
            return resJson
        } catch (err: any) {
            return err
        }
    }
}

