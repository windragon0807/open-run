import CategoryList from './CategoryList'
import CategoryTab from './CategoryTab'
import ContinuousList from './continuous/ContinuousList'
import GeneralList from './general/GeneralList'

export default async function ProgressList() {
  return (
    <div>
      <CategoryTab />
      <CategoryList normal={<GeneralList />} repeat={<ContinuousList />} />
    </div>
  )
}
