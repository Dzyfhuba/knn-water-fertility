import DataRaw from '@/types/data-raw'
import supabase from '@/variables/supabase'
import SweetAlertOption from '@/variables/sweetalert2'
import { Action, Thunk, action, createStore, thunk } from 'easy-peasy'
import Swal from 'sweetalert2'

export interface GlobalState {
  data: typeof DataRaw.Select[]
  setData: Action<GlobalState, typeof DataRaw.Select[]>
  getData: Thunk<GlobalState>
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
  }),
  isLoading: false,
  setLoading: action((state, payload) => {
    state.isLoading = payload
  })
})

export default store