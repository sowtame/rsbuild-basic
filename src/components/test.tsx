import { Button } from '@alfalab/core-components/button'
import { Alert } from '@alfalab/core-components/alert'

type Props = {}

export const Test = ({}: Props) => {
  return (
    <div>
      <Button>test now</Button>
      <Alert title="Alert"></Alert>
    </div>
  )
}
