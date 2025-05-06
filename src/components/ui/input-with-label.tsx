import { cn } from '@/lib/utils'
import type { AnyFieldApi } from '@tanstack/react-form'
import FieldInfo from './field-info'
import { Input } from './input'
import { Label } from './label'

type InputWithLabelProps = {
  field: AnyFieldApi
  label: string
  placeholder?: string
}

export default function InputWithLabel({
  field,
  label,
  placeholder,
}: InputWithLabelProps) {
  return (
    <div className="space-y-2">
      <Label
        data-error={!field.state.meta.isValid}
        className={cn('data-[error=true]:text-destructive')}
        htmlFor={field.name}
      >
        {label}
      </Label>
      <Input
        id={field.name}
        placeholder={placeholder || ''}
        value={field.state.value}
        onChange={e => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        aria-invalid={
          field.state.meta.errors.length > 0 && field.state.meta.isTouched
        }
      />
      <FieldInfo field={field} />
    </div>
  )
}
