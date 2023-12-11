import moment from 'moment'

const Time = {
  format: (raw: string) => {
    return moment(raw).format('YYYY-MM-DD HH:mm:ss')
  }
}

export default Time