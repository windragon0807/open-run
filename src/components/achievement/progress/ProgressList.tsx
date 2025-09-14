import CategoryList from './CategoryList'
import CategoryTab from './CategoryTab'
import NormalList from './normal/NormalList'
import RepeatList from './repeat/RepeatList'

export default function ProgressList() {
  return (
    <div>
      <CategoryTab />
      <CategoryList normal={<NormalList />} repeat={<RepeatList />} />
    </div>
  )
}
