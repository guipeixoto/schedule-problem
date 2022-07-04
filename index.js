const {format, addDays, addMonths, addMinutes} = require('date-fns')

// array de horários disponíveis
const availables = [];

// data de busca a "partir de"
let dateFrom = new Date('2022-07-01T07:00:00.000Z');
// intervalo do agendamento
const interval = 60;
// frequência do agendamento (diária ou mensal)
const frequence = 'DAILY' // 'DAILY' | 'MONTHLY'

const minIntervalSchedule = 30; // minutos
// agendamentos já salvos
const schedulesSaved = [
  {startDate: new Date('2022-07-01T09:00:00.000Z'), endDate: new Date('2022-07-01T10:00:00.000Z')},
  {startDate: new Date('2022-07-01T12:00:00.000Z'), endDate: new Date('2022-07-01T14:00:00.000Z')},
  {startDate: new Date('2022-07-01T16:00:00.000Z'), endDate: new Date('2022-07-01T17:30:00.000Z')},
  {startDate: new Date('2022-07-01T20:00:00.000Z'), endDate: new Date('2022-07-01T21:00:00.000Z')},
  {startDate: new Date('2022-07-15T08:00:00.000Z'), endDate: new Date('2022-07-15T09:00:00.000Z')}
];

const dateUntil = new Date(
  `${format(
    frequence === 'DAILY'
      ? addDays(dateFrom, 1)
      : addMonths(dateFrom, 1),
    'yyyy-MM-dd',
  )}T02:00:00.000Z`,
);

const lastPossibleSchedule = new Date(
  `${format(addDays(dateFrom, 1), 'yyyy-MM-dd')}T${String(
    process.env.LAST_SCHEDULE_TIME,
  )}`,
);


const getAvailables = () => {
  for (let index = 0; index < schedulesSaved.length; index++) {
    const schedule = schedulesSaved[index];

    while (
      addMinutes(dateFrom, interval) <=
      (schedulesSaved[Number(index) + 1] ? schedule.startDate : dateUntil)
    ) {
      availables.push({
        start: dateFrom,
        end: addMinutes(dateFrom, interval),
      });

      dateFrom = addMinutes(dateFrom, 30);

      if (dateFrom > lastPossibleSchedule) {
        break;
      }
    }

    dateFrom = schedule.endDate;
  }

  console.log(availables);
}

getAvailables();