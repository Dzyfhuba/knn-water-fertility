'use client'
import { useStoreState } from '@/state/hooks'
import KNN from '@/variables/knn'
import styles from './predicts.module.css'

const Predicts = () => {
  const { dataPartial } = useStoreState(state => state)

  const handlePredict = () => {
    console.log(dataPartial)
    if (dataPartial.length) {
      const dataTrain = dataPartial[0]
      const dataTest = dataPartial[1]

      const dataTrainX = dataTrain.map(item => [item.chlo_a as number, item.fosfat as number])
      const dataTrainY = dataTrain.map(item => item.kelas)

      const dataTestX = dataTest.map(item => [item.chlo_a, item.fosfat])
      const dataTestY = dataTest.map(item => item.kelas)

      console.log({dataTrainX})
      console.log({dataTrainY})

      console.log({dataTestX})
      console.log({dataTestY})

      // KNN
      const model = new KNN(1)
      model.train(dataTrainX, dataTrainY)

      const predictions = model.predict(dataTestX)

      console.log({predictions})
      
      // merge dataTestX, dataTestY back to {chlo_a, fosfat, kelas}
      const dataTestXY = dataTestX.map((item, index) => {
        return {
          chlo_a: item[0],
          fosfat: item[1],
          kelas: dataTestY[index]
        }
      })

      // merge dataTestXY, predictions back to {chlo_a, fosfat, kelas, kelasPredict}
      const dataTestXYPredict = dataTestXY.map((item, index) => {
        return {
          ...item,
          kelasPredict: predictions[index]
        }
      })

      console.log({dataTestXYPredict})
    }
  }


  return (
    <div>
      <h1>Predicts</h1>

      <button
        onClick={handlePredict}
        className={styles.predictsButton}
      >
        Predict
      </button>
    </div>
  )
}

export default Predicts