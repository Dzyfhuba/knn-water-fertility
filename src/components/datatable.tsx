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
import {
  useSort,
  HeaderCellSort,
} from '@table-library/react-table-library/sort'
import styles from './datatable.module.css'
import { MiddlewareFunction } from '@table-library/react-table-library/types/common'

type Props = {
  tableData: Data<TableNode>
}

const DataTable = (props: Props) => {
  const theme = useTheme({
    Table: `
        --data-table-library_grid-template-columns: 25% 25% 25% 25%;
        min-width: 400px;
      `,
    BaseCell: `
        border-bottom-width: 1px;
        border-color: #949494;
        padding: 4px;
        background-color: transparent;

        &:first-of-type {
          font-weight: bold;
          // width: 25px !important;
        }
      `,
    HeaderCell: `
        font-weight: bold;;
      `,
  })

  const onSortChange:MiddlewareFunction = (action, state) => {
    // console.log(action, state)
  }

  const sort = useSort(props.tableData, {
    onChange: onSortChange
  },
  {
    sortFns: {
      // @ts-ignore 
      ID: (array) => array.sort((a,b) => a.id - b.id),
      // @ts-ignore 
      CHLOROPHYLL: (array) => array.sort((a,b) => a.chlo_a - b.chlo_a),
      // @ts-ignore 
      PHOSPHATE: (array) => array.sort((a,b) => a.fosfat - b.fosfat),
      // @ts-ignore 
      FERTILITY: (array) => array.sort((a,b) => a.kelas.localeCompare(b.kelas)),
      // @ts-ignore 
      CREATED_AT: (array) => array.sort((a,b) => a.created_at - b.created_at),
      // @ts-ignore 
      UPDATED_AT: (array) => array.sort((a,b) => a.updated_at - b.updated_at),
    }
  })


  return (
    <div className={styles.container}>
      <Table data={props.tableData} theme={theme} sort={sort}>
        {(tableList: typeof DataRaw.Select[]) => (
          <>
            <Header>
              <HeaderRow>
                <HeaderCellSort sortKey='ID' resize>ID</HeaderCellSort>
                <HeaderCellSort sortKey='CHLOROPHYLL' resize>Chlorophyll A</HeaderCellSort>
                <HeaderCellSort sortKey='PHOSPHATE' resize>Phosphate</HeaderCellSort>
                <HeaderCellSort sortKey='FERTILITY' resize>Fertility</HeaderCellSort>
                <HeaderCellSort sortKey='CREATED_AT' resize hide>Created At</HeaderCellSort>
                <HeaderCellSort sortKey='UPDATED_AT' resize hide>Updated At</HeaderCellSort>
              </HeaderRow>
            </Header>
            <Body>
              {tableList.map(item => (
                <Row key={item.id} item={item}>
                  <Cell pinLeft>{item.id}</Cell>
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
  )
}

export default DataTable