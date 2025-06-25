declare module 'node-cas' {
    interface CASOptions {
        cas_url: string;
        service_url: string;
    }

    interface CASResponse {
        success: boolean;
        user: string;
        attributes: Record<string, any>;
    }

    class CAS {
        constructor(options: CASOptions);
        validate(ticket: string): Promise<CASResponse>;
    }

    export = CAS;
}
