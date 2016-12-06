import { Observable, Observer } from 'rxjs/Rx';
export declare class RxWebSocket<T> {
    private socket;
    private _outgoing$;
    private _incoming$;
    private _open$;
    serialize: (data: T) => string;
    deserialize: (data: string) => T;
    constructor(addr: string, protocols?: string[]);
    private receive(evt);
    private error(evt);
    private close(evt);
    private send(message);
    readonly open: Observable<boolean>;
    readonly incoming: Observable<T>;
    readonly outgoing: Observer<T>;
}
