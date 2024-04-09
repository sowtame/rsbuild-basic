import { Button } from '@alfalab/core-components/button'
import { Calendar } from '@alfalab/core-components/calendar'

type Props = {}

const TestLazy = ({}: Props) => {
  return (
    <div>
      <Button>lazy</Button>
      <Calendar open={true} />
    </div>
  )
}

export default TestLazy
