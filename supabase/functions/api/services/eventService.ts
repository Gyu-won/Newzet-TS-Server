import { EventListResDto } from '../models/dtos/event/eventListResDto.ts';
import { EventResDto } from '../models/dtos/event/eventResDto.ts';
import { EventBanner } from '../models/entities/eventBanner.ts';
import { EventRepository } from '../repositories/eventRepository.ts';

export class EventService {
  private eventRepository: EventRepository;

  constructor() {
    this.eventRepository = new EventRepository();
  }

  async getEventList(): Promise<EventListResDto> {
    const eventList: EventBanner[] = await this.eventRepository.getEventList();

    return new EventListResDto(eventList.map((event) => new EventResDto(event)));
  }
}
