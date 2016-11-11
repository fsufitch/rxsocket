if (typeof WebSocket === 'undefined') {
  WebSocket = require('ws');
}

import { Observable, Observer, Subject } from 'rxjs/Rx';

export class RxWebSocket<T> {
  private socket: WebSocket;
  private _outgoing$ = new Subject<T>();
  private _incoming$ = new Subject<T>();

  public serialize = (data: T) => JSON.stringify(data);
  public deserialize = (data: string) => <T>JSON.parse(data);

  constructor(addr: string, protocols?: string[]) {
    this.socket = new WebSocket(addr, protocols);
    this.socket.onmessage = (evt) => this.receive(evt);
    this.socket.onerror = (evt) => this.error(evt);
    this.socket.onclose = (evt) => this.close(evt);

    this._outgoing$.map(data => this.serialize(data)).subscribe(
      msg => this.send(msg),
      (err) => console.log("Error in outgoing data", err),
      () => this.socket.close()
    );
  }

  private receive(evt: {data: string}) {
    let deserialized = this.deserialize(<string>evt.data);
    this._incoming$.next(deserialized);
  }

  private error(evt: ErrorEvent) {
    this._incoming$.error(evt);
  }

  private close(evt: {wasClean: boolean, code: number, reason: string}) {
    this._incoming$.complete();
  }

  private send(message: string) {
    this.socket.send(message);
  }

  get incoming(): Observable<T> {
    return this._incoming$;
  }

  get outgoing(): Observer<T> {
    return this._outgoing$;
  }

}
