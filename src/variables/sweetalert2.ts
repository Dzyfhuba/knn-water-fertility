import { SweetAlertOptions } from 'sweetalert2'
import Colors from './colors'

interface Params {
  [x: string]: SweetAlertOptions<unknown, unknown>
}

const SweetalertParams: Params = {
  error: {
    confirmButtonColor: Colors.error,
    title: 'Error',
    confirmButtonText: 'Close'
  }
}

export default SweetalertParams