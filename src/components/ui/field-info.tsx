import type { AnyFieldApi } from '@tanstack/react-form'

export default function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <em className="text-destructive text-sm p-0">
          {field.state.meta.errors[0].message}
        </em>
      ) : // <em>{field.state.meta.errors.join(',')}</em>
      null}
      {field.state.meta.isValidating ? 'Validating...' : null}
    </>
  )
}
