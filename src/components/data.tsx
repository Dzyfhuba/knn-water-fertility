'use client'

import globalStyles from '@/app/global.module.css'
import { useStoreActions, useStoreState } from '@/state/hooks'
import DataRaw from '@/types/data-raw'
import { MiddlewareFunction } from '@table-library/react-table-library/types/common'
import { TableNode } from '@table-library/react-table-library/types/table'
import { SyntheticEvent, useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import styles from './data.module.css'
import DataTable from './datatable'
import Loading from './loading'

const Form = (props: {
  onSubmit: (formValue: DataRaw.Select) => void
  defaultValue?: DataRaw.Select
}) => {
  const [formData, setFormData] = useState({
    chlo_a: props.defaultValue?.chlo_a,
    fosfat: props.defaultValue?.fosfat,
    kelas: props.defaultValue?.kelas
  })

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault()
    props.onSubmit({
      chlo_a: formData.chlo_a || 0,
      fosfat: formData.fosfat || 0,
      kelas: formData.kelas || ''
    })
  }
  
  return (
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      <div>
        <label htmlFor={'chlo_a'} className={styles.inputLabel}>Chlo A</label>
        <input
          pattern="^\d*(\.\d{0,8})?$"
          required
          name={'chlo_a'}
          id={'chlo_a'}
          placeholder='Klorofil A...'
          className={styles.formInput}
          autoFocus
          defaultValue={props.defaultValue?.chlo_a}
          onChange={(e) => setFormData({ ...formData, chlo_a: Number(e.currentTarget.value) })}
        />
      </div>
      <div>
        <label htmlFor={'fosfat'} className={styles.inputLabel}>Fosfat</label>
        <input
          pattern="^\d*(\.\d{0,8})?$"
          required
          name={'fosfat'}
          id={'fosfat'}
          placeholder='Fosfat...'
          className={styles.formInput}
          defaultValue={props.defaultValue?.fosfat}
          onChange={(e) => setFormData({ ...formData, fosfat: Number(e.currentTarget.value) })}
        />
      </div>
      <div>
        <label htmlFor="kelas" className={styles.inputLabel}>Kelas</label>
        <select
          className={styles.formSelect}
          defaultValue={formData.kelas}
          onChange={(e) => setFormData({ ...formData, kelas: e.currentTarget.value })}
          required
        >
          <option value="" disabled selected hidden>Pilih Kelas...</option>
          <option value="Eutrofik">Eutrofik</option>
          <option value="Oligotrofik">Oligotrofik</option>
          <option value="Mesotrofik">Mesotrofik</option>
        </select>
      </div>
      <button
        className={styles.btnSubmit}
        type='submit'
      >
        Save
      </button>
    </form>
  )
}

const Data = () => {
  const { getData, updateData, deleteData, storeData } = useStoreActions((actions) => actions)
  const { data } = useStoreState((state) => state)
  const [ids, setIds] = useState<number[]>([])

  const ReactSwal = withReactContent(Swal)

  useEffect(() => {
    getData()
  }, [getData])

  const handleSelect = (
    action:{
      payload:{
        ids: number[]
        options: {
          isCarryForward: boolean
          isPartialToAll: boolean
        }
      }
    }, 
    state: {
      id: null
      ids: number[]
    }
  ) => {
    console.log({ action, state })
    setIds(state.ids)
  }

  const handleEdit = () => {
    console.log(data[ids[0]-1])
    ReactSwal.fire({
      title: 'Edit Data',
      html: <Form defaultValue={data[ids[0]]} onSubmit={async (formValue) => {
        updateData({ data: formValue, id: ids[0] })
      }} />,
      showConfirmButton: false,
      showCloseButton: true
    })
  }

  const handleDelete = () => {
    ReactSwal.fire({
      title: 'Delete Data',
      text: 'Apakah anda yakin ingin menghapus data ini?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Hapus',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteData({ ids })
      }
    })
  }

  const handleCreate = () => {
    ReactSwal.fire({
      title: 'Create Data',
      html: <Form onSubmit={async (formValue) => {
        storeData(formValue)
      }} />,
      showConfirmButton: false,
      showCloseButton: true
    })
  }

  return (
    <>
      <h1 className={globalStyles.title}>Data</h1>

      <div className={styles.actionGroup}>
        <div>
          <button
            type="button"
            className={styles.btnEdit + (ids.length === 1 ? '': ' !hidden')}
            onClick={handleEdit}
          >
          Edit
          </button>
          <button
            type="button"
            className={styles.btnDelete + (ids.length ? '': ' !hidden')}
            onClick={handleDelete}
          >
          Delete
          </button>
        </div>
        <button
          type="button"
          className={styles.btnCreate}
          onClick={handleCreate}
        >
          Create
        </button>
      </div>

      {
        data.length ? (
          <DataTable tableData={{ nodes: data as TableNode[] }} onSelect={handleSelect as unknown as MiddlewareFunction} />
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