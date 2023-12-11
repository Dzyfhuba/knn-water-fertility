'use client'

import supabase from '@/app/variables/supabase'
import DataRaw from '@/types/data-raw'
import { useEffect, useState } from 'react'

const Data = () => {
  const [data, setData] = useState<(typeof DataRaw.Select)[]>([])
  const getData = async () => {
    const {data, error} = await supabase.from('data_raw').select('*')

    if (!error) {
      setData(data)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <>
      <h1>Data</h1>

      {
        data.length ? (
          <>ada</>
        ) : (
          <>No Data</>
        )
      }
    </>
  )
}

export default Data