import { SweetAlertOptions } from 'sweetalert2'
import Colors from './colors'

interface Params {
  [x: string]: SweetAlertOptions<unknown, unknown>
}

const SweetalertParams: Params = {
  error: {
    confirmButtonColor: Colors.error,
    icon: 'error',
    title: 'Error',
    confirmButtonText: 'Close'
  },
  info: {
    confirmButtonColor: Colors.info,
    icon: 'info',
    title: 'Info',
    confirmButtonText: 'Close',
    showCloseButton: true
  }
}

export default SweetalertParams