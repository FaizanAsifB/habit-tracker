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
import type { TimeBlockFormData } from '@/features/calendar/components/forms/time-block-form'
import TimeBlockForm from '@/features/calendar/components/forms/time-block-form'
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
  type View,
} from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'

// Set up date-fns localizer for React Big Calendar
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

// type CalendarView = 'day' | 'week' | 'month'

interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  allDay?: boolean
  resource?: any
  category?: string
  completed?: boolean
  description?: string
}

interface EnergyLevelData {
  date: string
  level: number
}

export const Route = createFileRoute('/app/calendar/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [view, setView] = useState<View>('week')
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [dateTitle, setDateTitle] = useState('')
  const [showCompleted, setShowCompleted] = useState<boolean>(true)
  const [events, setEvents] = useState<CalendarEvent[]>(generateSampleEvents())

  const [isTimeBlockFormOpen, setIsTimeBlockFormOpen] = useState<boolean>(false)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)

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
        end: new Date(
          new Date(today.getFullYear(), today.getMonth(), 15, 12, 0)
        ),
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
        end: new Date(
          new Date(today.getFullYear(), today.getMonth(), 25, 17, 0)
        ),
        category: 'Work',
        allDay: true,
        completed: false,
        description: 'New product launch day',
      },
    ]
  }

  const goToToday = () => setSelectedDate(new Date())

  function navigatePrevious() {
    if (view === 'day') setSelectedDate(prevDate => addDays(prevDate, -1))
    if (view === 'week') setSelectedDate(prevDate => addDays(prevDate, -7))
    if (view === 'month') {
      const selectedMonth = new Date(selectedDate)
      selectedMonth.setMonth(selectedMonth.getMonth() - 1)
      setSelectedDate(selectedMonth)
    }
  }

  function navigateNext() {
    if (view === 'day') setSelectedDate(prevDate => addDays(prevDate, 1))
    if (view === 'week') setSelectedDate(prevDate => addDays(prevDate, 7))
    if (view === 'month') {
      const selectedMonth = new Date(selectedDate)
      selectedMonth.setMonth(selectedMonth.getMonth() + 1)
      setSelectedDate(selectedMonth)
    }
  }

  const handleUpdateEnergyLevel = (date: string, level: number) => {
    setEnergyLevels(prev => {
      const existing = prev.findIndex(item => item.date === date)
      if (existing !== -1) {
        return prev.map(item =>
          item.date === date ? { ...item, level } : item
        )
      } else {
        return [...prev, { date, level }]
      }
    })
  }

  // Event handlers for the calendar
  const handleSelectEvent = (event: CalendarEvent) => {
    setEditingEvent(event)
    setIsTimeBlockFormOpen(true)
  }

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    const newEvent: CalendarEvent = {
      id: '',
      title: '',
      start,
      end,
      category: 'Work',
    }
    setEditingEvent(newEvent)
    setIsTimeBlockFormOpen(true)
  }

  // Handle saving time block from the form
  const handleSaveTimeBlock = (data: TimeBlockFormData) => {
    const {
      title,
      description,
      date,
      startTime,
      endTime,
      category,
      completed,
    } = data

    // Convert date and time strings to Date objects
    const startDate = new Date(date)
    const [startHours, startMinutes] = startTime.split(':').map(Number)
    startDate.setHours(startHours, startMinutes, 0, 0)

    const endDate = new Date(date)
    const [endHours, endMinutes] = endTime.split(':').map(Number)
    endDate.setHours(endHours, endMinutes, 0, 0)

    const newEvent: CalendarEvent = {
      id: editingEvent?.id || Date.now().toString(),
      title,
      description,
      start: startDate,
      end: endDate,
      category,
      completed: completed || false,
    }

    if (editingEvent?.id) {
      // Update existing event
      setEvents(
        events.map(event => (event.id === editingEvent.id ? newEvent : event))
      )
    } else {
      // Add new event
      setEvents([...events, newEvent])
    }

    setIsTimeBlockFormOpen(false)
    setEditingEvent(null)
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
            <Button variant="outline" size="icon" onClick={navigatePrevious}>
              <ChevronLeft className="size-4" />
            </Button>
            <h2 className="text-xl font-bold ">{dateTitle}</h2>
            <Button variant="outline" size="icon" onClick={navigateNext}>
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
                setEditingEvent(null)
                setIsTimeBlockFormOpen(true)
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
            // onView={newView => {
            //   setView(newView)
            // }}
            // onNavigate={date => setCurrentDate(date)}
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
      <Dialog open={isTimeBlockFormOpen} onOpenChange={setIsTimeBlockFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingEvent?.id ? 'Edit Time Block' : 'Add Time Block'}
            </DialogTitle>
          </DialogHeader>
          <TimeBlockForm
            initialData={
              editingEvent
                ? {
                    title: editingEvent.title,
                    description: editingEvent.description || '',
                    date: editingEvent.start,
                    startTime: format(editingEvent.start, 'HH:mm'),
                    endTime: format(editingEvent.end, 'HH:mm'),
                    category: editingEvent.category,
                    completed: editingEvent.completed,
                  }
                : undefined
            }
            onSubmit={handleSaveTimeBlock}
            onCancel={() => setIsTimeBlockFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
