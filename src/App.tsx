import { Suspense, lazy, useState } from 'react'
import './App.css'
import { Test } from './components/test'
import { Button } from '@alfalab/core-components/button'

// const TestLazy = loadable(() => import('./components/testLazy'))

const TestLazy = lazy(() => import('./components/testLazy'))

export const App = () => {
  const [open, setOpen] = useState(false)
  return (
    <div className="content">
      <Test />
      <Button onClick={() => setOpen(!open)}>setOpen </Button>
      {/* {open && <TestLazy />} */}
      <div>13</div>
      <Suspense fallback={'loading'}>{open && <TestLazy />}</Suspense>
    </div>
  )
}
