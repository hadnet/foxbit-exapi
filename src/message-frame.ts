import {MessageType} from './message-enums';
import type {EndpointDescriptorByMethod} from './api-descriptors';

type Frame = {
  m: MessageType;
  i: number;
  n: string;
  o: string;
};
export class MessageFrame<T> {
  public sequence: number;

  constructor(
    public messageType: MessageType,
    public functionName: keyof EndpointDescriptorByMethod,
    public payload?: T,
  ) {
    this.sequence = 0;
  }

  toJSON(): Frame {
    return {
      m: this.messageType,
      i: this.sequence,
      n: this.functionName,
      o: JSON.stringify(this.payload),
    };
  }
}
