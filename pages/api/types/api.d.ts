declare namespace API {
    interface SUCCESS<T> {
        message: string;
        data: T;
    }

    interface ERROR {
        message: string;
        error: Error | unknown;
    }
}
