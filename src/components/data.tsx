'use client'

import globalStyles from '@/app/global.module.css'
import { useStoreActions, useStoreState } from '@/state/hooks'
import { useEffect } from 'react'
import styles from './data.module.css'
import DataTable from './datatable'
import Loading from './loading'
import { TableNode } from '@table-library/react-table-library/types/table'

const Data = () => {
  const { getData } = useStoreActions((actions) => actions)
  const { data } = useStoreState((state) => state)

  useEffect(() => {
    getData()
  }, [getData])


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