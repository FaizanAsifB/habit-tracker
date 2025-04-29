import { createFileRoute } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import EventForm from '@/features/calendar/components/forms/event-form'
import { cn } from '@/lib/utils'
import { addDays, format, getDay, parse, startOfWeek } from 'date-fns'
import { enUS } from 'date-fns/locale'
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Filter,
  PlusCircle,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import {
  Calendar as BigCalendar,
  dateFnsLocalizer,
  Views,
  type Event,
  type View,
} from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const locales = {
  'en-US': enUS,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
})

const CALENDAR_NAVIGATION_DIRECTION = {
  NEXT: 1,
  PREVIOUS: -1,
} as const

type CalendarNavigationDirection =
  (typeof CALENDAR_NAVIGATION_DIRECTION)[keyof typeof CALENDAR_NAVIGATION_DIRECTION]

export interface CalendarEvent extends Event {
  id?: string
  title?: string
  category?: string
  completed?: boolean
  description?: string
}

function generateSampleEvents(): CalendarEvent[] {
  const today = new Date()

  // Create copies of today's date to modify without affecting the original
  const todayEvents = new Date(today)
  const tomorrowEvents = addDays(new Date(today), 1)
  const dayAfterEvents = addDays(new Date(today), 2)

  return [
    {
      id: '1',
      title: 'Morning Meditation',
      start: new Date(new Date(todayEvents).setHours(7, 0, 0, 0)),
      end: new Date(new Date(todayEvents).setHours(7, 30, 0, 0)),
      category: 'Mindfulness',
      completed: true,
      description: 'Focus on breathing and mindfulness',
    },
    {
      id: '2',
      title: 'Workout Session',
      start: new Date(new Date(todayEvents).setHours(8, 30, 0, 0)),
      end: new Date(new Date(todayEvents).setHours(9, 30, 0, 0)),
      category: 'Fitness',
      completed: false,
      description: 'Strength training day',
    },
    {
      id: '3',
      title: 'Project Planning',
      start: new Date(new Date(tomorrowEvents).setHours(10, 0, 0, 0)),
      end: new Date(new Date(tomorrowEvents).setHours(11, 30, 0, 0)),
      category: 'Work',
      completed: false,
      description: 'Quarterly goals review',
    },
    {
      id: '4',
      title: 'Team Meeting',
      start: new Date(new Date(tomorrowEvents).setHours(14, 0, 0, 0)),
      end: new Date(new Date(tomorrowEvents).setHours(15, 0, 0, 0)),
      category: 'Work',
      completed: false,
      description: 'Weekly sync',
    },
    {
      id: '5',
      title: 'Evening Run',
      start: new Date(new Date(dayAfterEvents).setHours(18, 0, 0, 0)),
      end: new Date(new Date(dayAfterEvents).setHours(19, 0, 0, 0)),
      category: 'Fitness',
      completed: false,
      description: '5k easy pace',
    },
    // Add more events scattered throughout the month for better monthly view
    {
      id: '6',
      title: 'Monthly Review',
      start: new Date(
        new Date(today.getFullYear(), today.getMonth(), 15, 10, 0)
      ),
      end: new Date(new Date(today.getFullYear(), today.getMonth(), 15, 12, 0)),
      category: 'Work',
      completed: false,
      description: 'Monthly team review',
    },
    {
      id: '7',
      title: 'Yoga Class',
      start: new Date(
        new Date(today.getFullYear(), today.getMonth(), 20, 18, 0)
      ),
      end: new Date(
        new Date(today.getFullYear(), today.getMonth(), 20, 19, 30)
      ),
      category: 'Mindfulness',
      completed: false,
      description: 'Hatha yoga session',
    },
    {
      id: '8',
      title: 'Product Launch',
      start: new Date(
        new Date(today.getFullYear(), today.getMonth(), 25, 9, 0)
      ),
      end: new Date(new Date(today.getFullYear(), today.getMonth(), 25, 17, 0)),
      category: 'Work',
      allDay: true,
      completed: false,
      description: 'New product launch day',
    },
  ]
}

const mockEvents = generateSampleEvents()

export const Route = createFileRoute('/app/calendar/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [view, setView] = useState<View>('week')
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [dateTitle, setDateTitle] = useState('')
  const [showCompleted, setShowCompleted] = useState<boolean>(true)
  const [events, setEvents] = useState<CalendarEvent[]>(mockEvents)

  const [isEventFormOpen, setIsEventFormOpen] = useState<boolean>(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | undefined>(
    undefined
  )

  useEffect(() => {
    if (view === 'day') setDateTitle(format(selectedDate, 'MMMM d, yyyy'))
    if (view === 'week') {
      const start = startOfWeek(selectedDate, { weekStartsOn: 1 })
      const end = addDays(start, 6)
      const title = `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`
      setDateTitle(title)
    }
    if (view === 'month') {
      setDateTitle(format(selectedDate, 'MMMM yyyy'))
    }
  }, [selectedDate, view])

  const calendarStyles = useMemo(
    () => ({
      height: 'calc(100vh - 220px)',
      className:
        'bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700',
    }),
    []
  )

  const goToToday = () => setSelectedDate(new Date())

  function navigateCalendar(direction: CalendarNavigationDirection) {
    if (view === 'day')
      setSelectedDate(prevDate => addDays(prevDate, direction))
    if (view === 'week')
      setSelectedDate(prevDate => addDays(prevDate, direction * 7))
    if (view === 'month') {
      const selectedMonth = new Date(selectedDate)
      selectedMonth.setMonth(selectedMonth.getMonth() + direction)
      setSelectedDate(selectedMonth)
    }
  }

  function handleSelectEvent(event: CalendarEvent) {
    setSelectedEvent(event)
    setIsEventFormOpen(true)
  }

  function handleSelectSlot({ start, end }: { start: Date; end: Date }) {
    setSelectedEvent({
      start,
      end,
    })
    setIsEventFormOpen(true)
  }

  // Custom event styling
  const eventStyleGetter = (event: CalendarEvent) => {
    const style = {
      backgroundColor:
        event.category === 'Mindfulness'
          ? '#f3e8ff'
          : event.category === 'Fitness'
          ? '#d1fae5'
          : event.category === 'Work'
          ? '#dbeafe'
          : event.category === 'Learning'
          ? '#fef3c7'
          : event.category === 'Personal'
          ? '#fce7f3'
          : '#f9fafb',
      borderLeft: `4px solid ${
        event.category === 'Mindfulness'
          ? '#a78bfa'
          : event.category === 'Fitness'
          ? '#10b981'
          : event.category === 'Work'
          ? '#3b82f6'
          : event.category === 'Learning'
          ? '#f59e0b'
          : event.category === 'Personal'
          ? '#ec4899'
          : '#9ca3af'
      }`,
      color: '#374151',
      borderRadius: '4px',
      opacity: event.completed ? 0.6 : 1,
      paddingLeft: '4px',
    }

    return {
      style,
      // className: `event-item ${event.completed ? 'completed' : ''}`,
      className: event.completed ? 'completed' : '',
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div className="flex items-center gap-2 ">
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                navigateCalendar(CALENDAR_NAVIGATION_DIRECTION.PREVIOUS)
              }
            >
              <ChevronLeft className="size-4" />
            </Button>
            <h2 className="text-xl font-bold ">{dateTitle}</h2>
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                navigateCalendar(CALENDAR_NAVIGATION_DIRECTION.NEXT)
              }
            >
              <ChevronRight className="size-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={goToToday}>
              Today
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon">
                  <CalendarIcon className="size-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-50">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={date => date && setSelectedDate(date)}
                  initialFocus
                  className={cn('p-3 pointer-events-auto')}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Tabs
              defaultValue="week"
              value={view}
              onValueChange={value => setView(value as View)}
              className="w-[400px]"
            >
              <TabsList>
                <TabsTrigger value="day">Day</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
              </TabsList>
            </Tabs>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowCompleted(!showCompleted)}
                  className={!showCompleted ? 'bg-gray-100' : ''}
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {showCompleted ? 'Hide completed' : 'Show completed'}
              </TooltipContent>
            </Tooltip>

            <Button
              onClick={() => {
                setSelectedEvent(undefined)
                setIsEventFormOpen(true)
              }}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Time Block
            </Button>
          </div>
        </div>
        {/* Main calendar content */}
        <div className=" bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
          <BigCalendar
            localizer={localizer}
            events={
              showCompleted ? events : events.filter(event => !event.completed)
            }
            startAccessor="start"
            endAccessor="end"
            defaultView={'week'}
            view={view}
            date={selectedDate}
            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleSelectSlot}
            selectable
            eventPropGetter={eventStyleGetter}
            toolbar={false}
            formats={{
              eventTimeRangeFormat: () => {
                return ''
              },
            }}
            dayPropGetter={date => {
              const today = new Date()
              return {
                className:
                  format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
                    ? 'rbc-today'
                    : '',
              }
            }}
            popup
            views={[Views.DAY, Views.WEEK, Views.MONTH]}
            style={calendarStyles}
          />
        </div>
      </div>

      {/* Time Block Form Dialog */}
      <Dialog open={isEventFormOpen} onOpenChange={setIsEventFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedEvent?.id ? 'Edit Event' : 'Add New Event'}
            </DialogTitle>
          </DialogHeader>
          <EventForm initialData={selectedEvent} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
