import PromisingService from '../services/promising-service';

const PromisingController = {
    async base() {
        await PromisingService.baseFunc();
    },
    async create(req: any, res: any) {
        try {
            const resJson = await PromisingService.create(req, res)
            return res.status(200).json(resJson)
        } catch (err) {
            return res.status(500).json(err)
        }
    }
};

export default PromisingController;

