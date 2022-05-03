declare namespace API {
    interface SUCCESS<T> {
        code: string;
        data: T;
    }

    interface ERROR {
        code: string;
        error?: Error | unknown;
    }
}
