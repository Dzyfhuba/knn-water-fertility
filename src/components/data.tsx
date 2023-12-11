'use client'

import { useStoreActions, useStoreState } from '@/state/hooks'
import DataRaw from '@/types/data-raw'
import { Data } from '@/types/table'
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
import { useEffect } from 'react'
import styles from './data.module.css'
import globalStyles from '@/app/global.module.css'
import moment from 'moment'
import Time from '@/variables/time'
import { useTheme } from '@table-library/react-table-library/theme'
import Loading from './loading'

const Data = () => {
  const { getData } = useStoreActions((actions) => actions)
  const { data } = useStoreState((state) => state)

  const tableData: Data<TableNode> = {
    nodes: data
  }

  useEffect(() => {
    getData()
  }, [])

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



  console.log(data)
  return (
    <>
      <h1 className={globalStyles.title}>Data</h1>

      {
        data.length ? (
          <div className={styles.container}>
            <Table data={tableData} theme={theme}>
              {(tableList: typeof DataRaw.Select[]) => (
                <>
                  <Header>
                    <HeaderRow>
                      <HeaderCell resize hide>ID</HeaderCell>
                      <HeaderCell resize>Chlorophyll A</HeaderCell>
                      <HeaderCell resize>Phosphate</HeaderCell>
                      <HeaderCell resize>Fertility</HeaderCell>
                      <HeaderCell resize hide>Created At</HeaderCell>
                      <HeaderCell resize hide>Updated At</HeaderCell>
                    </HeaderRow>
                  </Header>
                  <Body>
                    {tableList.map(item => (
                      <Row key={item.id} item={item}>
                        <Cell hide>{item.id}</Cell>
                        <Cell>{item.chlo_a}</Cell>
                        <Cell>{item.fosfat}</Cell>
                        <Cell>{item.kelas}</Cell>
                        <Cell hide>{Time.format(item.created_at)}</Cell>
                        <Cell hide>{Time.format(item.updated_at)}</Cell>
                      </Row>
                    ))}
                  </Body>
                </>
              )}
            </Table>
          </div>
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