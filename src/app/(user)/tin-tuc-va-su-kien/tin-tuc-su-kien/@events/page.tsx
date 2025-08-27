import {fetchNewsEvents} from "@/app/(user)/tin-tuc-va-su-kien/(fetch-data)/fetch-news-events";
import EventList from './event-list'

export default async function EventSlot() {
    const events = await fetchNewsEvents('events');
    return <EventList data={events}/>;
}
