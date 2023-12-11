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

  dataPartial: [],
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
    let dataPart = []
    for (let i = 0; i < dataLength; i++) {
      dataPart.push(data[i])
      if (i % dataLengthPerPart === 0 && i !== 0) {
        dataPartial.push(dataPart)
        dataPart = []
      }
    }
    dataPartial.push(dataPart)
    actions.setDataPartial(dataPartial)
  }),

  isLoading: false,
  setLoading: action((state, payload) => {
    state.isLoading = payload
  })
})

export default store