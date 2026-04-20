import { useState } from 'react'
import Login from '@/components/Login'; // Ajusta la ruta a tu componente

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className=''>
        <Login />
      </div>
    </>
  )
}

export default App
