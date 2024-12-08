import BungDetails from '@components/bung/BungDetails'
import { fetchBungDetail } from '@apis/bungs/fetchBungDetails/api'

type Props = {
  params: {
    bungId: string
  }
}

export default async function Page({ params: { bungId } }: Props) {
  const { data } = await fetchBungDetail({ bungId })

  const isParticipated = true
  const isOwner = true

  return <BungDetails details={data} isParticipated={isParticipated} isOwner={isOwner} />
}
