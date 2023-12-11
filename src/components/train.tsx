'use client'

import globalStyles from '@/app/global.module.css'
import { useStoreActions, useStoreState } from '@/state/hooks'
import DataRaw from '@/types/data-raw'
import { Data as Train } from '@/types/table'
import Time from '@/variables/time'
import {
  Body,
  Cell,
  Header,
  HeaderCell,
  HeaderRow,
  Row,
  Table,
  TableNode
} from '@table-library/react-table-library/table'
import { useTheme } from '@table-library/react-table-library/theme'
import { useEffect } from 'react'
import styles from './train.module.css'
import Loading from './loading'
import DataTable from './datatable'

const Train = () => {
  const { getData, separateData } = useStoreActions((actions) => actions)
  const { data, dataPartial } = useStoreState((state) => state)

  const tableData: Train<TableNode> = {
    nodes: data
  }

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
      <h1 className={globalStyles.title}>Data</h1>
      {
        data.length ? (
          <button onClick={() => separateData()} autoFocus className={styles.shuffleButton}>
            Shuffle and Split Data
          </button>
        ) : (
          <div className={styles.loadingContainer}>
            <Loading size='lg' />
          </div>
        )
      }
      {
        dataPartial.length ? (
          <p>Membagi data menggunakan K-Fold Cross Validation menjadi 4 bagian seperti berikut:</p>
        ) : (
          <></>
        )
      }
      <div className={styles.container}>
        {
          data.length ? (dataPartial.length ? dataPartial.map((data, idx) => (
            <div key={idx}>
              <h2 className={styles.subTitle}>table {idx + 1}</h2>
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