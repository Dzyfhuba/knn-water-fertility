'use client'

import globalStyles from '@/app/global.module.css'
import { useStoreActions, useStoreState } from '@/state/hooks'
import { useTheme } from '@table-library/react-table-library/theme'
import { useEffect } from 'react'
import DataTable from './datatable'
import Loading from './loading'
import styles from './train.module.css'

const Train = () => {
  const { getData, separateData } = useStoreActions((actions) => actions)
  const { data, dataPartial, kFoldCrossValidation } = useStoreState((state) => state)


  useEffect(() => {
    getData().then(() => {
    })
    console.log('data sync')
  }, [getData])

  const theme = useTheme({
    Table: `
        --data-table-library_grid-template-columns:  30px 120px 70px 100px 200px 200px;
        min-width: 400px;
      `,
    BaseCell: `
        border-bottom-width: 1px;
        border-color: #949494;
        padding: 4px;
        background-color: transparent;
      `,
  })


  return (
    <>
      <h1 className={globalStyles.title}>Title</h1>
      {
        data.length ? (
          <>
            <button onClick={() => separateData()} autoFocus className={styles.shuffleButton}>
            Shuffle and Split Data
            </button>
            <div className="hidden">
              {
                kFoldCrossValidation.modelScore ? (
                  <p>K Fold Cross Validation Score: {kFoldCrossValidation.modelScore}</p>
                ) : <></>
              }
            </div>
            <p>Membagi data menggunakan K-Fold Cross Validation menjadi 4 bagian seperti berikut:</p>
          </>
        ) : (
          <div className={styles.loadingContainer}>
            <Loading size='lg' />
          </div>
        )
      }
      <div className={styles.container}>
        {
          data.length ? (dataPartial.length ? dataPartial.map((data, idx) => (
            <div key={idx}>
              <h2 className={styles.subTitle}>table {idx + 1} (length: {data.length})</h2>
              <DataTable tableData={{ nodes: data }} />
            </div>
          )) : (
            !data.length ? (
              <div className={styles.loadingContainer}>
                <Loading size='lg' />
              </div>
            ) : (
              <></>
            )
        
          )) : (
            <></>
          )
        }
      </div>
    </>
  )
}

export default Train