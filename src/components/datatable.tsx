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
import styles from './datatable.module.css'

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

        &:first-child {
          font-weight: bold;
          // width: 25px !important;
        }
      `,
    HeaderCell: `
        font-weight: bold;;
      `,
  })

  return (
    <div className={styles.container}>
      <Table data={props.tableData} theme={theme}>
        {(tableList: typeof DataRaw.Select[]) => (
          <>
            <Header>
              <HeaderRow>
                <HeaderCell resize>ID</HeaderCell>
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