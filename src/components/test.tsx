'use client'
import { useStoreState } from '@/state/hooks'
import globalStyles from '@/app/global.module.css'
import KNN, { ConfusionMatrix, Label } from '@/variables/knn'
import styles from './test.module.css'
import { useEffect, useState } from 'react'
import DataTable from './datatable'
import DataRaw from '@/types/data-raw'
import Swal from 'sweetalert2'
import SweetalertParams from '@/variables/sweetalert2'
import kFoldCrossValidation from '@/variables/validation'
import { TableNode } from '@table-library/react-table-library/types/table'
import getVisibleLength from '@/variables/visibleLength'
import Procedure from './procedure'
import Process from '@/types/procedure'
import DataTable2 from './dataTable2'
import Client from './client'


const Test = () => {
  const { dataPartial: dataPartialState } = useStoreState(state => state)
  const [calculatedData, setCalculatedData] = useState<DataRaw.Select[]>([])
  const [confustionMatrix, setConfustionMatrix] = useState<ConfusionMatrix>({})
  const [indexTrain, setIndexTrain] = useState<number[]>([])
  const [indexTest, setIndexTest] = useState<number>(0)
  const [dataTrain, setDataTrain] = useState<DataRaw.Select[]>([])
  const [k, setK] = useState(5)

  const [process, setProcess] = useState<Process[]>([])

  useEffect(() => {
    const dataTestXYPredict = localStorage.getItem('dataTestXYPredict')
    const confustionMatrix = localStorage.getItem('confustionMatrix')
    const trainData = localStorage.getItem('trainData')
    const proce = localStorage.getItem('testProcess')

    if (dataTestXYPredict && confustionMatrix && trainData && proce) {
      setCalculatedData(JSON.parse(dataTestXYPredict))
      setConfustionMatrix(JSON.parse(confustionMatrix))
      setDataTrain(JSON.parse(trainData))
      // setProcess(JSON.parse(proce))
    }
  }, [])

  const handlePredict = () => {
    try {
      const dataPartial = JSON.parse(localStorage.getItem('dataPartial') as string) as DataRaw.Select[][] || dataPartialState
      if (dataPartial.length) {
        const temp = [...dataPartial]
        // generate random index for dataTrain without duplicate
        let indexTrain: number[] = []
        let indexTest: number = 0
        do {
          indexTrain = Array.from({ length: 3 }, () => Math.floor(Math.random() * temp.length))
          indexTest = Math.floor(Math.random() * temp.length)
        } while (indexTrain[0] === indexTrain[1] || indexTrain[0] === indexTrain[2] || indexTrain[1] === indexTrain[2] || indexTrain.includes(indexTest))
        // console.log(indexTrain, indexTest)

        // get dataTrain and dataTest
        let dataTrain = dataPartial.filter((item, index) => indexTrain.includes(index)).flat()
        const dataTest = temp[indexTest]

        // sort dataTrain
        dataTrain = dataTrain.sort((a, b) => a.id! - b.id!)

        setDataTrain(dataTrain)


        // console.log({ dataTrain })
        // console.log({ dataTest })

        // console.log({ indexTrain })
        // console.log({ indexTest })

        setIndexTrain(indexTrain)
        setIndexTest(dataPartial.findIndex(item => item === dataTest))

        const dataTrainX = dataTrain.map(item => [item.chlo_a as number, item.fosfat as number])
        const dataTrainY = dataTrain.map(item => item.kelas as Label)
        const dataTrainRest = dataTrainX.map((item, index) => {
          return {
            created_at: dataTrain[index].created_at,
            updated_at: dataTrain[index].updated_at,
          }
        })

        const dataTestX = dataTest.map(item => [item.chlo_a, item.fosfat])
        const dataTestY = dataTest.map(item => item.kelas as Label)
        const dataTestRest = dataTestX.map((item, index) => {
          return {
            id: dataTest[index].id as number,
            created_at: dataTest[index].created_at as string,
            updated_at: dataTest[index].updated_at as string,
          }
        })

        // KNN
        const model = new KNN(k)
        // model.train(dataTrainX, dataTrainY)

        model.weighted.train(dataTrainX, dataTrainY)

        const predictions = model.predict(dataTestX)

        const weightedPredictions = model.weighted.predict(dataTestX)

        // console.log({ predictions })

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
            id: dataTestRest[index].id as number,
            chlo_a: item.chlo_a,
            fosfat: item.fosfat,
            kelas: item.kelas,
            kelasPredict: weightedPredictions[index].label,
            // distance: weightedPredictions[index].distance,
            weights: weightedPredictions[index].weights,
            created_at: dataTestRest[index].created_at,
            updated_at: dataTestRest[index].updated_at,
          }
        })

        // console.log({ dataTestXYPredict })

        // calculate confusion matrix
        const confustionMatrix = model.confusionMatrix(dataTestY, weightedPredictions.map(item => item.label))

        console.log({ confustionMatrix })

        // sort dataTestXYPredict
        dataTestXYPredict.sort((a, b) => a.id! - b.id!)

        setCalculatedData(dataTestXYPredict)
        setConfustionMatrix(confustionMatrix)

        // set process
        const proce = [
          {
            title: 'Distance Between Train Data',
            content: (
              <Client>
                <DataTable2
                  columns={[
                    {
                      id: 'chloA',
                      title: 'Chlo A',
                      sort: false,
                      width: 'auto',
                    },
                    {
                      id: 'fosfat',
                      title: 'Fosfat',
                      sort: false,
                      width: 'auto',
                    },
                    {
                      id: 'label',
                      title: 'Label',
                      sort: false,
                      width: 'auto',
                    },
                    {
                      id: 'distance',
                      title: 'distance',
                      sort: false,
                      width: 'auto',
                    },
                  ]}
                  data={
                    model.getDistanceBetweenData()!.map((item, idx) => ({
                      chloA: item[idx].item[0],
                      fosfat: item[idx].item[1],
                      label: item[idx].label,
                      distance: '',
                      nodes: item.sort((a, b) => a.distance - b.distance)
                        .filter(a => a.distance !== 0).map((i, idx2) => ({
                          id: i.id,
                          chloA: i.item2[0],
                          fosfat: i.item2[1],
                          label: i.label2,
                          distance: i.distance,
                          isSelected: idx2 < k,
                        }))
                    }))}
                  enableTree
                />
              </Client>
            )
          },
          {
            title: 'Validasi Data Training',
            content: (
              <Client>
                <DataTable2
                  columns={[
                    {
                      id: 'chloA',
                      title: 'Chlorophile A',
                      sort: false,
                      width: 'auto',
                    },
                    {
                      id: 'fosfat',
                      title: 'Fosfat',
                      sort: false,
                      width: 'auto',
                    },
                    {
                      id: 'label',
                      title: 'Label',
                      sort: false,
                      width: 'auto',
                    },
                    {
                      id: 'validity',
                      title: 'Validity',
                      sort: false,
                      width: 'auto',
                    },
                  ]}
                  data={
                    model.getValidites()!.map((item, idx) => ({
                      chloA: item.data[idx][0],
                      fosfat: item.data[idx][1],
                      label: dataTrainY[idx],
                      validity: item.validity,
                      nodes: item.dataSortedByDistance.map((i, idx2) => ({
                        id: i.id,
                        chloA: i.data[0],
                        fosfat: i.data[1],
                        label: i.label,
                        validity: i.validity
                      }))
                    }))}
                  enableTree
                />
              </Client>
            )
          },
          {
            title: 'Perhitungan Weight Voting (Train)',
            content: (
              <Client>
                <DataTable2
                  columns={[
                    {
                      id: 'chloA',
                      title: 'Chlorophile A',
                      sort: false,
                      width: 'auto',
                    },
                    {
                      id: 'fosfat',
                      title: 'Fosfat',
                      sort: false,
                      width: 'auto',
                    },
                    {
                      id: 'label',
                      title: 'Actual Label',
                      sort: false,
                      width: 'auto',
                    },
                    {
                      id: 'weight',
                      title: 'Weight / Predicted Label',
                      sort: false,
                      width: 'auto',
                    },
                  ]}
                  data={
                    model.getWeights()!.map((item, idx) => ({
                      chloA: item[idx].item[0],
                      fosfat: item[idx].item[1],
                      label: item[idx].label,
                      weight: model.majorityVote(
                        item.sort((a, b) => b.weight - a.weight)
                          .filter(a => a.distance !== 0).map((i, idx2) => (
                            i.label2
                          ))
                          .slice(0, k)
                      ),
                      nodes: item.sort((a, b) => b.weight - a.weight)
                        .filter(a => a.distance !== 0).map((i, idx2) => ({
                          id: i.id,
                          chloA: i.item2[0],
                          fosfat: i.item2[1],
                          label: i.label2,
                          weight: i.weight,
                          isSelected: idx2 < k,
                        }))
                    }))}
                  enableTree
                />
              </Client>
            )
          },
          {
            title: 'Perhitungan Weight Voting (Test)',
            content: (
              <Client>
                <DataTable2
                  columns={[
                    {
                      id: 'chloA',
                      title: 'Chlorophile A',
                      sort: false,
                      width: 'auto',
                    },
                    {
                      id: 'fosfat',
                      title: 'Fosfat',
                      sort: false,
                      width: 'auto',
                    },
                    {
                      id: 'label',
                      title: 'Actual Label',
                      sort: false,
                      width: 'auto',
                    },
                    {
                      id: 'weight',
                      title: 'Weight / Predicted Label',
                      sort: false,
                      width: 'auto',
                    },
                  ]}
                  data={
                    dataTestXYPredict.map((item, idx) => ({
                      chloA: item.chlo_a,
                      fosfat: item.fosfat,
                      label: item.kelas,
                      weight: item.kelasPredict,
                      nodes: item.weights!
                        .map((i, idx2) => ({
                          id: i.id,
                          chloA: i.data[0],
                          fosfat: i.data[1],
                          label: i.label,
                          weight: i.weight,
                          isSelected: idx2 < k
                        }))
                    }))}
                  enableTree
                />
              </Client>
            )
          },
        ]
        setProcess(proce)

        // store dataTestXYPredict and confustionMatrix to localStorage
        localStorage.setItem('dataTestXYPredict', JSON.stringify(dataTestXYPredict))
        localStorage.setItem('confustionMatrix', JSON.stringify(confustionMatrix))
        localStorage.setItem('trainData', JSON.stringify(dataTrain))
        localStorage.setItem('testProcess', JSON.stringify(proce))
      }

    } catch (error) {
      // console.log(error)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: JSON.stringify(error),
        ...SweetalertParams.error
      })
    }
  }

  const calculatedDataLength = getVisibleLength(calculatedData)

  console.log(process)

  return (
    <div>
      <h1 className={globalStyles.title}>Test</h1>

      {process.length ? <Procedure process={process} /> : <></>}

      <form className={styles.kForm + ' join'} onSubmit={(e) => {
        e.preventDefault()
        handlePredict()
      }}>
        <input
          type="number"
          className={styles.inputK + ' sm:join-item w-full'}
          placeholder='Insert K here... (Default: K=5)'
          onChange={(e) => {
            setK(Number(e.target.value))
          }}
        />
        <button
          type='submit'
          className={styles.testButton + ' sm:join-item w-full sm:w-max'}
          disabled={!!!(k % 2)}
        >
          Predict With Test Data
        </button>
      </form>


      <p>Tabel {indexTrain.map(i => i + 1).join('-')} sebagai train.</p>
      <p>Tabel {indexTest + 1} sebagai test.</p>

      <h2>Confusion Matrix</h2>
      <div className={styles.confusionMatrix}>
        {
          Object.values(confustionMatrix).map((value, index) => (
            <p key={index}>
              {Object.keys(confustionMatrix)[index]}: {value}
            </p>
          ))
        }
      </div>


      <h2>Hasil Prediksi Data Test</h2>
      <p>Length: {calculatedData.length}</p>
      <DataTable
        tableData={{ nodes: calculatedData as TableNode[] }}
        length={calculatedDataLength}
      />

      <h2>Train Data</h2>
      <p>Length: {dataTrain.length}</p>
      <DataTable tableData={{ nodes: dataTrain as TableNode[] }} />
    </div>
  )
}

export default Test