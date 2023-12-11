import DataRaw from '@/types/data-raw'
import supabase from '@/variables/supabase'
import SweetAlertOption from '@/variables/sweetalert2'
import { Action, Thunk, action, createStore, thunk } from 'easy-peasy'
import Swal from 'sweetalert2'

export interface GlobalState {
  data: typeof DataRaw.Select[]
  setData: Action<GlobalState, typeof DataRaw.Select[]>
  getData: Thunk<GlobalState>
  dataPartial: typeof DataRaw.Select[][]
  setDataPartial: Action<GlobalState, typeof DataRaw.Select[][]>
  separateData: Thunk<GlobalState>
  isLoading: boolean
  setLoading: Action<GlobalState, boolean>
}

const store = createStore<GlobalState>({
  data: [],
  setData: action((state, payload) => {
    state.data = payload
  }),
  getData: thunk(async (actions) => {
    actions.setLoading(true)
    const {data, error} = await supabase.from('data_raw').select('*')
    if (!error) {
      actions.setData(data)
    } else {
      
      Swal.fire({
        ...SweetAlertOption.error,
        text: error.message
      })
    }
    actions.setLoading(false)
    return data
  }),

  dataPartial: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('dataPartial') || '[]') : [],
  setDataPartial: action((state, payload) => {
    state.dataPartial = payload
  }),
  separateData: thunk((actions) => {
    // separate data into 4 parts
    const data = store.getState().data
    // shuffle data
    data.sort(() => Math.random() - 0.5)
    const dataPartial = []
    const dataLength = data.length
    const dataLengthPerPart = Math.floor(dataLength / 4)
    let dataPart:typeof DataRaw.Select[] = []
    for (let i = 0; i < 4; i++) {
      dataPart = data.slice(i * dataLengthPerPart, (i + 1) * dataLengthPerPart)
      dataPartial.push(dataPart)
    }
    dataPartial.push(dataPart)
    actions.setDataPartial(dataPartial)

    console.log(dataPartial)

    // store to local storage
    localStorage.setItem('dataPartial', JSON.stringify(dataPartial))
  }),

  isLoading: false,
  setLoading: action((state, payload) => {
    state.isLoading = payload
  })
})

export default store