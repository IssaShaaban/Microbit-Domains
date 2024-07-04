export const generateRecurringEvents=(eventID, eventName, startDate, duration, count, timeOnADay, daysOfEvent)=> {
    const recurringEvents = [];
  
    for (let i = 0; i < count; i++) {
      const currentStartDate = new Date(startDate);
      currentStartDate.setDate(currentStartDate.getDate() + i);
  
      const currentEventStartDate = new Date(currentStartDate);
      const currentEventEndDate = new Date(currentStartDate);
  
      // Set the time on a day
      const [hours, minutes] = timeOnADay.split(':');
      currentEventStartDate.setHours(parseInt(hours, 10), parseInt(minutes, 10));
      
      // Set the duration
      currentEventEndDate.setTime(currentEventStartDate.getTime() + duration);
  
      // Check if the current day is in the specified daysOfEvent
      const currentDay = currentEventStartDate.getDay();
      if (daysOfEvent.includes(currentDay)) {
        recurringEvents.push({
          id: [eventID],
          text: eventName,
          startDate: currentEventStartDate,
          endDate: currentEventEndDate,
        });
      }
    }
  
    return recurringEvents;
  }

export const prisonersTimetable = [
    ...generateRecurringEvents(1, "Wake up call", new Date("2024-03-05T06:00:00.000Z"), 30*60*1000, 20, '06:00', [1,2,3,4,5]),
    ...generateRecurringEvents(1, "Wake up call", new Date("2024-03-05T07:00:00.000Z"), 30*60*1000, 20, '07:00', [0,6]),
    ...generateRecurringEvents(2, "Breakfast & Shower", new Date("2024-03-05T06:30:00.000Z"), 60*60*1000, 20, '06:30', [1,2,3,4,5]),
    ...generateRecurringEvents(2, "Breakfast & Shower", new Date("2024-03-05T07:30:00.000Z"), 60*60*1000, 20, '07:30', [0,6]),
    ...generateRecurringEvents(3, "Roll call", new Date("2024-03-05T07:30:00.000Z"), 30*60*1000, 20, '07:30', [1,2,3,4,5]),
    ...generateRecurringEvents(3, "Roll call", new Date("2024-03-05T08:30:00.000Z"), 30*60*1000, 20, '08:30', [0,6]),,
    ...generateRecurringEvents(2, "Lunch", new Date("2024-03-05T12:00:00.000Z"), 30*60*1000, 20, '12:00', [0,1,2,3,4,5,6]),
    ...generateRecurringEvents(3, "Roll call", new Date("2024-03-05T12:30:00.000Z"), 30*60*1000, 20, '12:30', [0,1,2,3,4,5,6]),
    ...generateRecurringEvents(2, "Tea time", new Date("2024-03-05T16:00:00.000Z"), 30*60*1000, 20, '16:00', [0,1,2,3,4,5,6]),
    ...generateRecurringEvents(3, "Roll call", new Date("2024-03-05T16:30:00.000Z"), 30*60*1000, 20, '16:30', [0,1,2,3,4,5,6]),
    ...generateRecurringEvents(2, "Dinner", new Date("2024-03-05T19:30:00.000Z"), 30*60*1000, 20, '19:30', [0,1,2,3,4,5,6]),
    ...generateRecurringEvents(3, "Roll call", new Date("2024-03-05T20:00:00.000Z"), 30*60*1000, 20, '20:00', [0,1,2,3,4,5,6]),
    ...generateRecurringEvents(5, "Lock up", new Date("2024-03-05T21:30:00.000Z"), 30*60*1000, 20, '21:30', [0,1,2,3,4,5,6]),
    ...generateRecurringEvents(6, "Lights out", new Date("2024-03-05T22:00:00.000Z"), 60*60*1000, 20, '22:00', [0,1,2,3,4,5,6]),
    ...generateRecurringEvents(7, "Sleep", new Date("2024-03-05T23:00:00.000Z"), 8*60*60*1000, 20, '23:00', [5,6]),
    ...generateRecurringEvents(7, "Sleep", new Date("2024-03-05T23:00:00.000Z"), 7*60*60*1000, 20, '23:00', [0,1,2,3,4]),
  
  // {
  //   text: 'Lunch',
  //   startDate: new Date("2024-02-21T12:00:00.000Z"),
  //   endDate: new Date("2024-02-21T13:00:00.000Z"),
  //   recurrenceRule: 'FREQ=DAILY; COUNT=7;',
  // }
  ];

  export const guardsTimetable = [
    ...generateRecurringEvents(8, "Patrol", new Date("2024-03-05T23:00:00.000Z"), 30*60*1000, 20, '23:00', [0,1,2,6]),
    ...generateRecurringEvents(10, "Visitation area", new Date("2024-03-05T00:30:00.000Z"), 210*60*1000, 20, '00:30', [0,1,2,6]),
    ...generateRecurringEvents(11, "Security room", new Date("2024-03-05T04:30:00.000Z"), 3*60*60*1000, 20, '04:30', [0,1,2,3]),
    ...generateRecurringEvents(4, "Outdoor area", new Date("2024-03-05T10:00:00.000Z"), 60*60*1000, 20, '10:00', [0,1,2,6]),
    ...generateRecurringEvents(5, "Lock up", new Date("2024-03-05T21:30:00.000Z"), 30*60*1000, 20, '21:30', [0,1,2,3,6]),
    ...generateRecurringEvents(9, "Break", new Date("2024-03-05T11:00:00.000Z"), 30*60*1000, 20, '11:00', [0,1,2,3,4,5,6]),
    ...generateRecurringEvents(9, "Break", new Date("2024-03-05T15:00:00.000Z"), 30*60*1000, 20, '15:00', [0,1,2,3,4,5,6]),
    ...generateRecurringEvents(9, "Break", new Date("2024-03-05T00:00:00.000Z"), 30*60*1000, 20, '00:00', [0,1,2,3,4,5,6]),
    ...generateRecurringEvents(9, "Break", new Date("2024-03-05T04:00:00.000Z"), 30*60*1000, 20, '04:00', [0,1,2,3,4,5,6]),

  ];
  export const prisonSupervisorsTimetable = [
    ...generateRecurringEvents(1, "Wake up call", new Date("2024-03-05T06:00:00.000Z"), 30*60*1000, 20, '06:00', [1,2,3,4,5]),
    ...generateRecurringEvents(3, "Roll call", new Date("2024-03-05T07:30:00.000Z"), 30*60*1000, 20, '07:30', [1,2,3,4,5]),
    ...generateRecurringEvents(3, "Roll call", new Date("2024-03-05T08:30:00.000Z"), 30*60*1000, 20, '08:30', [0,6]),
    ...generateRecurringEvents(3, "Roll call", new Date("2024-03-05T12:30:00.000Z"), 30*60*1000, 20, '12:30', [0,1,2,3,4,5,6]),
    ...generateRecurringEvents(3, "Roll call", new Date("2024-03-05T16:30:00.000Z"), 30*60*1000, 20, '16:30', [0,1,2,3,4,5,6]),
    ...generateRecurringEvents(3, "Roll call", new Date("2024-03-05T20:00:00.000Z"), 30*60*1000, 20, '20:00', [0,1,2,3,4,5,6]),
  ];
  export const prisonManagersTimetable = [
    ...generateRecurringEvents(0, "Meeting", new Date("2024-03-05T11:00:00.000Z"), 60*60*1000, 20, '11:00', [0,1,2,3,4,5,6]),
  ];

  export const hotelEventsTimetable = [
    ...generateRecurringEvents(2, "Breakfast", new Date("2024-03-08T08:00:00.000Z"), 3*60*60*1000, 20, '08:00', [0,1,2,3,4,5,6]),
  ];

  export const staffsTimetable = [
    ...generateRecurringEvents(9, "Break", new Date("2024-03-08T12:30:00.000Z"), 30*60*1000, 20, '12:30', [0,1,2,3,4,5,6]),
  ]

  export const hotelSupervisorsTimetable = [
    ...generateRecurringEvents(7, "Morning briefing", new Date("2024-03-08T08:00:00.000Z"), 60*60*1000, 20, '08:00', [0,1,2,3,4,5,6]),
    ...generateRecurringEvents(8, "Staff training", new Date("2024-03-08T10:00:00.000Z"), 2*60*60*1000, 20, '10:00', [1,2,3,4,5]),
    ...generateRecurringEvents(1, "Room inspections", new Date("2024-03-08T14:00:00.000Z"), 60*60*1000, 20, '14:00', [0,1,2,3,4,5,6]),
    ...generateRecurringEvents(3, "Turn in report", new Date("2024-03-08T16:00:00.000Z"), 60*60*1000, 20, '16:00', [0,1,2,3,4,5,6]),
    ...generateRecurringEvents(9, "Break", new Date("2024-03-08T12:30:00.000Z"), 30*60*1000, 20, '12:30', [0,1,2,3,4,5,6]),

    ...generateRecurringEvents(7, "Evening shift staff briefing", new Date("2024-03-08T18:00:00.000Z"), 60*60*1000, 20, '18:00', [0,1,2,3,4,5,6]),
  ]

  export const hotelManagersTimetable = [
    ...generateRecurringEvents(7, "Morning briefing", new Date("2024-03-08T08:00:00.000Z"), 60*60*1000, 20, '08:00', [0,1,2,3,4,5,6]),
    ...generateRecurringEvents(1, "Meeting", new Date("2024-03-08T09:00:00.000Z"), 60*60*1000, 20, '09:00', [0,1,2,3,4,5,6]),
    ...generateRecurringEvents(5, "Review reports", new Date("2024-03-08T10:00:00.000Z"), 60*60*1000, 20, '10:00', [0,1,2,3,4,5,6]),
    ...generateRecurringEvents(5, "Property inspection", new Date("2024-03-08T14:00:00.000Z"), 60*60*1000, 20, '14:00', [0,1,2,3,4,5,6]),
    ...generateRecurringEvents(7, "Evening shift staff briefing", new Date("2024-03-08T18:00:00.000Z"), 60*60*1000, 20, '18:00', [0,1,2,3,4,5,6]),
  ]

  export const schoolTimetable = [
    ...generateRecurringEvents(7, "Assembly", new Date("2024-03-15T06:00:00.000Z"), 60*60*1000, 1, '06:00', [0,1,2,3,4,5,6]),
  ]

export const resourcesData = [
{
    id: 1, // wake up call
    color: '#faa19b',
},
{
    id: 2, // breakfast, lunch, tea, dinner at cafeteria
    color: '#86bcd9',
},
{
    id: 3, // roll calls at outdoor area
    color: '#3f633c',
},
{
    id: 4, // work or free times
    color: '#c7ab63',
},
{ 
    id: 5, // lock up
    color: '#8d89c4',
},
{
    id: 6, // lights out
    color: '#7a7980',
},
{
    id: 7, // sleep
    color:'#967195',
},
{
  id: 8, // patrol
  color: '#8fdba3'
},
{
  id: 9, // staffs break
  color: '#eba9bc'
},
{
  id: 10, // visitation area
  color: '#d49ee6'
},
{
  id: 11, // security room
  color: '#0476b0'
}
];