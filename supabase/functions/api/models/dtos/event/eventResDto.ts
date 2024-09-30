import { EventBanner } from '../../entities/eventBanner.ts';

export class EventResDto {
  imageUrl: string;
  eventUrl: string;

  constructor(event: EventBanner) {
    this.imageUrl = event.image_url;
    this.eventUrl = event.event_url;
  }
}
