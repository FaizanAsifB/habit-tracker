import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DatePickerForm } from '@/components/ui/date-picker-form'
import FieldInfo from '@/components/ui/field-info'
import FormItem from '@/components/ui/form-item'
import { Input } from '@/components/ui/input'
import InputWithLabel from '@/components/ui/input-with-label'
import { Label } from '@/components/ui/label'
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
import { useForm } from '@tanstack/react-form'
import { format } from 'date-fns'
import type { Dispatch, SetStateAction } from 'react'
import { z } from 'zod'

const EventSchema = z.object({
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

type EventForm = z.infer<typeof EventSchema>

type EventFormProps = {
  initialData?: Partial<CalendarEvent>
  setIsFormOpen: Dispatch<SetStateAction<boolean>>
}

export default function EventForm({
  initialData,
  setIsFormOpen,
}: EventFormProps) {
  const handleSubmit = (value: EventForm) => {
    console.log(value)
    // const { title, description, start, end, category, completed } = event

    const updatedStartDate = new Date(value.startDate)
    const [startHours, startMinutes] = value.allDay
      ? [0, 0]
      : value.startTime.split(':').map(Number)
    updatedStartDate.setHours(startHours, startMinutes, 0, 0)

    const updatedEndDate = new Date(value.endDate)
    const [endHours, endMinutes] = value.allDay
      ? [23, 59]
      : value.endTime.split(':').map(Number)
    updatedEndDate.setHours(endHours, endMinutes, 0, 0)

    const newEvent: CalendarEvent = {
      id: initialData?.id || Date.now().toString(),
      title: value.title,
      description: value.description,
      start: updatedStartDate,
      end: updatedEndDate,
      allDay: value.allDay,
      category: value.category,
      completed: value.completed,
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

  const form = useForm({
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
      allDay: initialData?.allDay || false,
      category: initialData?.category || 'Work',
      completed: false,
    } as EventForm,
    validators: { onBlur: EventSchema },
    onSubmit: ({ value }) => handleSubmit(value),
  })

  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="space-y-4"
      >
        <form.Field
          name="title"
          children={field => <InputWithLabel field={field} label={'Title'} />}
        />
        <div className="flex gap-4">
          <form.Field
            name="startDate"
            children={field => (
              <FormItem>
                <Label>Start Date</Label>
                <DatePickerForm field={field} />
                <FieldInfo field={field} />
              </FormItem>
            )}
          />
          <form.Subscribe
            selector={state => state.values.allDay}
            children={allday =>
              !allday && (
                <form.Field name="startTime">
                  {field => (
                    <FormItem>
                      <Label>Start Time</Label>
                      <Input
                        type="time"
                        value={field.state.value}
                        onChange={e => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        aria-invalid={
                          field.state.meta.errors.length > 0 &&
                          field.state.meta.isTouched
                        }
                      />
                    </FormItem>
                  )}
                </form.Field>
              )
            }
          />
        </div>
        <div className="flex gap-4">
          <form.Field
            name="endDate"
            children={field => (
              <FormItem>
                <Label>End Date</Label>
                <DatePickerForm field={field} />
                <FieldInfo field={field} />
              </FormItem>
            )}
          />

          <form.Subscribe
            selector={state => state.values.allDay}
            children={allday =>
              !allday && (
                <form.Field name="endTime">
                  {field => (
                    <FormItem>
                      <Label>End Time</Label>
                      <Input
                        type="time"
                        value={field.state.value}
                        onChange={e => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        aria-invalid={
                          field.state.meta.errors.length > 0 &&
                          field.state.meta.isTouched
                        }
                      />
                    </FormItem>
                  )}
                </form.Field>
              )
            }
          />
        </div>
        <form.Field
          name="allDay"
          children={field => (
            <div className="flex items-start gap-2">
              <Switch
                checked={field.state.value}
                onCheckedChange={field.handleChange}
                className="cursor-pointer"
              />
              <Label className="leading-none">All Day</Label>
              <FieldInfo field={field} />
            </div>
          )}
        />
        <form.Field
          name="category"
          children={field => (
            <FormItem>
              <Label>Category</Label>
              <Select
                onValueChange={field.handleChange}
                defaultValue={field.state.value}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Work">Work</SelectItem>
                  <SelectItem value="Personal">Personal</SelectItem>
                  <SelectItem value="Fitness">Fitness</SelectItem>
                  <SelectItem value="Mindfulness">Mindfulness</SelectItem>
                  <SelectItem value="Learning">Learning</SelectItem>
                </SelectContent>
              </Select>
              <FieldInfo field={field} />
            </FormItem>
          )}
        />
        <form.Field
          name="completed"
          children={field => (
            <div>
              <div className="flex items-start gap-2">
                <Checkbox
                  id={field.name}
                  checked={field.state.value}
                  onCheckedChange={checkedState =>
                    field.handleChange(!!checkedState)
                  }
                />
                <Label
                  htmlFor={field.name}
                  data-error={!field.state.meta.isValid}
                  className="leading-none"
                >
                  Completed
                </Label>
              </div>
              <FieldInfo field={field} />
            </div>
          )}
        />
        <form.Field
          name="description"
          children={field => (
            <FormItem>
              <Label htmlFor={field.name}>Description</Label>
              <Textarea
                id={field.name}
                placeholder="Add details..."
                value={field.state.value}
                onChange={e => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                aria-invalid={
                  field.state.meta.errors.length > 0 &&
                  field.state.meta.isTouched
                }
              />
              <FieldInfo field={field} />
            </FormItem>
          )}
        />
        <form.Subscribe
          selector={state => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => setIsFormOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!canSubmit}>
                {isSubmitting ? '...' : 'Submit'}
              </Button>
            </div>
          )}
        />
      </form>
    </div>
  )
}
