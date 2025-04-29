import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DatePicker } from '@/components/ui/date-picker'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import type { CalendarEvent } from '@/routes/app/calendar'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const eventFormSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().optional(),
  startDate: z.date({
    required_error: 'Start date is required',
  }),
  startTime: z.string(),
  endDate: z.date({
    required_error: 'End date is required',
  }),
  endTime: z.string(),
  allDay: z.boolean(),
  category: z.string(),
  completed: z.boolean(),
})

type EventForm = z.infer<typeof eventFormSchema>

type EventFormProps = {
  initialData?: Partial<CalendarEvent>
}

export default function EventForm({ initialData }: EventFormProps) {
  console.log(initialData)
  const form = useForm<EventForm>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      startDate: initialData?.start || new Date(),
      startTime: format(initialData?.start || new Date(), 'HH:mm'),
      endDate: initialData?.end || new Date(),
      endTime: format(
        initialData?.end || new Date(new Date().getTime() + 60 * 60 * 1000),
        'HH:mm'
      ),
      allDay: false,
      category: initialData?.category || 'Work',
      completed: initialData?.completed || false,
    },
  })

  const handleSubmit = (event: EventForm) => {
    const { title, description, start, end, category, completed } = event

    console.log(event)
    const startDate = new Date(start)
    console.log(startDate)
    const [startHours, startMinutes] = start.split(':').map(Number)
    startDate.setHours(startHours, startMinutes, 0, 0)

    const endDate = new Date(end)
    const [endHours, endMinutes] = end.split(':').map(Number)
    endDate.setHours(endHours, endMinutes, 0, 0)

    const newEvent: CalendarEvent = {
      // id: initialData?.id || Date.now().toString(),
      title,
      description,
      start: startDate,
      end: endDate,
      category,
      completed: completed || false,
    }

    if (initialData?.id) {
      // Update existing event
      // setEvents(
      //   events.map(event => (event.id === editingEvent.id ? newEvent : event))
      // )
    } else {
      // Add new event
      // setEvents([...events, newEvent])
    }

    // setIsTimeBlockFormOpen(false)
    // setEditingEvent(null)
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
                <DatePicker field={field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <DatePicker field={field} />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="allDay"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="cursor-pointer"
                />
              </FormControl>
              <div className="leading-none">
                <FormLabel>All Day</FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Work">Work</SelectItem>
                  <SelectItem value="Personal">Personal</SelectItem>
                  <SelectItem value="Fitness">Fitness</SelectItem>
                  <SelectItem value="Mindfulness">Mindfulness</SelectItem>
                  <SelectItem value="Learning">Learning</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="completed"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Completed</FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Add details..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-2">
          <Button variant="outline" type="button" onClick={() => {}}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  )
}
