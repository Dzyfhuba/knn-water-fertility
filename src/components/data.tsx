'use client'

import globalStyles from '@/app/global.module.css'
import { useStoreActions, useStoreState } from '@/state/hooks'
import DataRaw from '@/types/data-raw'
import Time from '@/variables/time'
import {
  Body,
  Cell,
  Data,
  Header,
  HeaderCell,
  HeaderRow,
  Row,
  Table,
  TableNode
} from '@table-library/react-table-library/table'
import { useTheme } from '@table-library/react-table-library/theme'
import { useEffect } from 'react'
import styles from './data.module.css'
import Loading from './loading'
import DataTable from './datatable'

const Data = () => {
  const { getData } = useStoreActions((actions) => actions)
  const { data } = useStoreState((state) => state)

  useEffect(() => {
    getData()
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
          <DataTable tableData={{nodes: data as TableNode[]}} />
        ) : (
          <div className={styles.loadingContainer}>
            <Loading size='lg' />
          </div>
        )
      }
    </>
  )
}

export default Data