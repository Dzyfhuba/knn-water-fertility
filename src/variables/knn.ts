type Feature = number[]
type Label = 'Eutrofik' | 'Oligotrofik' | 'Mesotrofik'

class KNN {
  private k: number
  private features?: Feature[]
  private labels?: Label[]

  constructor(k: number) {
    this.k = k
  }

  public getK(): number {
    return this.k
  }

  public setK(k: number): void {
    this.k = k
  }

  // set training data
  public train(features: Feature[], labels: Label[]): void {
    if (features.length !== labels.length) {
      throw new Error('features and labels must have the same length')
    }

    this.features = features
    this.labels = labels
  }

  // calculate euclidean distance
  private distance(a: Feature, b: Feature): number {
    const [x1, y1] = a
    const [x2, y2] = b

    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
  }

  // majority vote
  private majorityVote(labels: Label[]): Label {
    const votes = labels.reduce((acc, label) => {
      if (!acc[label]) {
        acc[label] = 0
      }

      acc[label] += 1

      return acc
    }, {} as Record<Label, number>)

    const sortedVotes = Object.entries(votes).sort((a, b) => b[1] - a[1])

    return sortedVotes[0][0] as Label
  }

  // predict label
  public predict(features: Feature[]): Label[] {
    if (!this.features || !this.labels) {
      throw new Error('train the model first')
    }

    const predictions = features.map((feature) => {
      const distances = this.features!.map((f) => this.distance(feature, f))
      const sortedDistances = distances.map((distance, index) => ({
        distance,
        label: this.labels![index],
      })).sort((a, b) => a.distance - b.distance)

      const kNearestLabels = sortedDistances.slice(0, this.k).map((d) => d.label)

      return this.majorityVote(kNearestLabels)
    })

    return predictions
  }
}

export default KNN