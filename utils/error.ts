export class httpException extends Error {
    timestamp: Date;
    status: number;
    error: string;
    exception: string;
    message: string;

    constructor(error: string, status: number) {
        super(error);
        this.timestamp = new Date();
        this.status = status;
        this.error = error;
        this.exception = '';
        this.message = '';
    }
}

export class notFoundException extends httpException {
    constructor(model: string, id: number | string) {
        super(`id ${id} not found in ${model}`, 404);
    }
}

export class validationException extends httpException {
    constructor(param: any) {
        super(`parameter ${param} required. please check header or body`, 401);
    }
}
