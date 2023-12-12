'use client'

import globalStyles from '@/app/global.module.css'
import DataRaw from '@/types/data-raw'
import { SyntheticEvent, createRef, useEffect, useState } from 'react'
import styles from './predict.module.css'
import { MdDelete } from 'react-icons/md'
import DataTable from './datatable'
import { TableNode } from '@table-library/react-table-library/types/table'

const InputContainer = (props: {
  index: number
}) => {
  return (
    <div className={styles.gridContainer+' box'}>
      <span>{props.index}</span>
      <div>
        <label htmlFor={`chlo_a-${props.index}`} className={styles.inputLabel}>Chlo A</label>
        <input
          type="number"
          required
          name={`chlo_a-${props.index}`}
          id={`chlo_a-${props.index}`}
          placeholder='Klorofil A...'
          className={styles.formInput}
        />
      </div>
      <div>
        <label htmlFor={`fosfat-${props.index}`} className={styles.inputLabel}>Fosfat</label>
        <input
          type="number"
          required
          name={`fosfat-${props.index}`}
          id={`fosfat-${props.index}`}
          placeholder='Fosfat...'
          className={styles.formInput}
        />
      </div>
      <button 
        type="button" 
        className={styles.formDestroy}
        onClick={(e) => {
          e.currentTarget.closest('div.box')?.remove()
        }}
      >
        <MdDelete size={24} />
      </button>
    </div>
  )
}

const Predict = () => {
  const [predictData, setPredictData] = useState<DataRaw.Select[]>([])
  const [length, setLength] = useState(1)

  useEffect(() => {
    const data = localStorage.getItem('predictData')
    if (data) {
      setPredictData(JSON.parse(data))
    }
  }, [])

  const handleFormAddPredict = (e:SyntheticEvent) => {
    e.preventDefault()

    const form = e.currentTarget as HTMLFormElement
    const inputs = form.querySelectorAll('input')
    
    const chloA: number[] = []
    const fosfat: number[] = []

    inputs.forEach((input, i) => {
      if (i%2 === 0) {
        chloA.push(Number(input.value))
      } else {
        fosfat.push(Number(input.value))
      }
    })

    const data: DataRaw.Select[] = chloA.map((chloA, i) => ({
      id: i+1,
      chlo_a: chloA,
      fosfat: fosfat[i],
    }))
    
    setPredictData(data)
    localStorage.setItem('predictData', JSON.stringify(data))
  }

  return (
    <div>
      <h1 className={globalStyles.title}>Predict</h1>

      <ul className={styles.collapseContainer}>
        <li>
          <details className={styles.detailsContainer}>
            <summary>Isi data untuk prediksi</summary>
            <form className={styles.form} onSubmit={handleFormAddPredict}>
              {
                Array.from({length}).map((_, i) => (<InputContainer key={i} index={i+1} />))
              }
              <button
                type='button'
                className={styles.btnAddPredict}
                onClick={() => {
                  setLength(length+1)
                }}
              >
                Tambah Data Prediksi
              </button>
              <button
                type='submit'
                className={styles.btnSubmit}
              >
                Submit
              </button>
            </form>
          </details>

        </li>
      </ul>

      {/* Data Predict */}
      <DataTable tableData={{nodes: predictData as TableNode[]}} />
      
    </div>
  )
}



export default Predict