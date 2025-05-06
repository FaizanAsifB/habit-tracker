import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { FormControl } from '@/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import type { AnyFieldApi } from '@tanstack/react-form'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import type {
  ControllerRenderProps,
  FieldPath,
  FieldValues,
} from 'react-hook-form'

// type DatePickerProps<
//   TFieldValues extends FieldValues = FieldValues,
//   TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
// > = {
//   field: ControllerRenderProps<TFieldValues, TName>
// }

export function DatePickerForm({ field }: { field: AnyFieldApi }) {
  return (
    <>
      <Popover modal>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              'w-[240px] pl-3 text-left font-normal',
              !field.state.value && 'text-muted-foreground'
            )}
          >
            {field.state.value ? (
              format(field.state.value, 'PPP')
            ) : (
              <span>Pick a date</span>
            )}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={field.state.value}
            onSelect={field.handleChange}
            disabled={date => date < new Date('1900-01-01')}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </>
  )
}
