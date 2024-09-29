import { EventResDto } from './eventResDto.ts';

export class EventListResDto {
  eventList: EventResDto[];

  constructor(eventList: EventResDto[]) {
    this.eventList = eventList;
  }
}
