'use client'

import globalStyles from '@/app/global.module.css'
import DataRaw from '@/types/data-raw'
import { useState } from 'react'

const Predict = () => {
  const [predictData, setPredictData] = useState<DataRaw.Select[]>([])

  return (
    <div>
      <h1 className={globalStyles.title}>Predict</h1>
      
      <button>
        
      </button>
    </div>
  )
}

export default Predict