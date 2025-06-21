// renderer/calendar.ts
import { Calendar } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import React from 'react';
import './calendar.css'; // 引入自定义样式

export interface CalendarEvent {
  date: string;
  time: string;
  title: string;
}

type Props = {
  events: CalendarEvent[];
};

function parseToFullCalendarEvent(raw: CalendarEvent) {
 const timeFormatted = raw.time.replace(/([0-9]{1,2}:[0-9]{2})([ap])$/i, (_, t, meridian) =>
    t + (meridian.toLowerCase() === 'p' ? ' PM' : ' AM')
  );

  const dateWithoutWeekday = raw.date.replace(/^\w+, /, '');

  const dateTimeStr = `${dateWithoutWeekday} ${timeFormatted}`;

  const dt = new Date(dateTimeStr);
  if (isNaN(dt.getTime())) {
    throw new Error(`Invalid date: ${dateTimeStr}`);
  }

  const startDate = dt.toISOString();

  const endDate = new Date(dt.getTime() + 60 * 1000);

  console.log(`Parsed event: ${raw.title} at ${startDate}`);

  return {
    title: raw.title,
    start: startDate,
    end: endDate,
    allDay: false,
  };
}

export const CalendarView: React.FC<Props> = ({ events }) => {
  return (
    <div id="calendar-wrapper">
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events.map(parseToFullCalendarEvent)}
        height="auto"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: '', // 简洁视图，去掉 week/day 切换
        }}
      />
    </div>
  );
};