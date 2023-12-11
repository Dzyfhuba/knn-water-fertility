import DataRaw from '@/types/data-raw'
import supabase from '@/variables/supabase'
import SweetAlertOption from '@/variables/sweetalert2'
import kFoldCrossValidation from '@/variables/validation'
import { Action, Thunk, action, createStore, thunk } from 'easy-peasy'
import Swal from 'sweetalert2'

export interface GlobalState {
  // data: typeof DataRaw.Select[]
  data: DataRaw.Select[]
  setData: Action<GlobalState, DataRaw.Select[]>
  getData: Thunk<GlobalState>
  dataPartial: DataRaw.Select[][]
  setDataPartial: Action<GlobalState, DataRaw.Select[][]>
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
    const dataPartial = kFoldCrossValidation(store.getState().data)
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