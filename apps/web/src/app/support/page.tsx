import type { Metadata } from 'next'
import Link from 'next/link'
import {
  DetailList,
  InfoPanel,
  LegalDocumentPage,
  LegalSection,
  MailButton,
  MailLink,
  SimpleList,
  SUPPORT_EMAIL,
} from '@components/legal/LegalDocumentPage'

const supportTopics = [
  {
    title: '로그인 및 지갑 연결',
    body: '소셜 로그인, 스마트 월렛 연결, 지갑 연결 실패, 연결 해제 문제를 문의할 수 있습니다.',
  },
  {
    title: '위치 권한 및 주변 정보',
    body: '위치 권한 요청, 현재 위치 확인, 장소 검색, 주변 벙 탐색이 정상 동작하지 않는 경우를 확인합니다.',
  },
  {
    title: '러닝 벙과 챌린지',
    body: '벙 생성, 참여, 멤버 관리, 완료 처리, 챌린지 진행도와 관련된 문제를 도와드립니다.',
  },
  {
    title: '아바타와 디지털 리워드',
    body: '아바타 저장, 디지털 리워드 표시, 리워드 수령 상태와 관련된 문제를 확인합니다.',
  },
  {
    title: '계정 삭제 및 개인정보 요청',
    body: '앱 내 계정 탈퇴 흐름과 이메일을 통한 개인정보 열람, 정정, 삭제 요청을 확인합니다.',
  },
]

export default function SupportPage() {
  return (
    <LegalDocumentPage
      activePath='/support'
      label='HELP ROUTE'
      title='OpenRun 지원'
      description='문제가 생긴 화면과 상황을 알려주면 로그인, 위치 권한, 지갑 연결, 러닝 챌린지, 디지털 리워드 흐름을 확인합니다.'
      dateLabel='지원 기준일'
      quickFacts={[
        { label: 'MAIL', value: SUPPORT_EMAIL },
        { label: 'ACCOUNT', value: '프로필 > 설정 > 계정 탈퇴' },
        { label: 'VERSION', value: 'iOS 1.0.0' },
      ]}
      aside={
        <>
          <InfoPanel title='CONTACT' tone='dark'>
            문의는 아래 이메일로 보내주세요.
            <MailButton>이메일로 문의하기</MailButton>
          </InfoPanel>
          <InfoPanel title='SCOPE'>
            로그인, 위치 권한, 지갑 연결, 벙/챌린지, 디지털 리워드, 계정 삭제 요청을 확인합니다.
          </InfoPanel>
          <InfoPanel title='PRIVACY'>
            개인정보 처리방침은{' '}
            <Link className='font-bold text-primary underline underline-offset-4' href='/privacy'>
              /privacy
            </Link>
            에서 확인할 수 있습니다.
          </InfoPanel>
        </>
      }>
      <LegalSection checkpoint='CP-01' title='먼저 알려주세요'>
        <p>
          지원이 필요한 경우 <MailLink /> 로 이메일을 보내주세요. 접수 순서대로 확인합니다.
        </p>
        <SimpleList
          items={[
            '사용 중인 기기와 iOS 버전',
            'OpenRun 앱 버전',
            '문제가 발생한 화면',
            '문제가 발생한 시간',
            '가능하다면 오류 화면 또는 상황 설명',
          ]}
        />
      </LegalSection>

      <LegalSection checkpoint='CP-02' title='지원 항목'>
        <DetailList items={supportTopics} />
      </LegalSection>

      <LegalSection checkpoint='CP-03' title='계정 삭제와 개인정보 요청'>
        <p>
          계정 탈퇴는 앱의 프로필 &gt; 설정 &gt; 계정 탈퇴에서 직접 진행할 수 있습니다. 별도 개인정보 열람, 정정, 삭제 요청은{' '}
          <MailLink /> 로 접수합니다.
        </p>
        <p>
          계정 삭제가 완료되면 앱 내 계정 정보와 연결된 서비스 데이터는 삭제 또는 비식별 처리됩니다. 다만 법령 준수, 분쟁 대응,
          보안 로그, 블록체인 공개 원장에 기록된 정보처럼 즉시 삭제할 수 없거나 OpenRun이 통제할 수 없는 정보는 별도 기준에 따라
          처리될 수 있습니다. 계정 삭제와 개인정보 요청은 본인 확인 후 처리합니다.
        </p>
      </LegalSection>

      <LegalSection checkpoint='CP-04' title='위치 권한 문제'>
        <p>
          OpenRun은 주변 정보와 러닝 벙 기능을 위해 위치 권한을 사용할 수 있습니다. 위치가 동작하지 않으면 iPhone의 설정에서
          OpenRun 위치 권한이 허용되어 있는지 확인해 주세요.
        </p>
      </LegalSection>

      <LegalSection checkpoint='CP-05' title='디지털 리워드 안내'>
        <p>
          OpenRun의 디지털 리워드는 러닝 활동과 챌린지 기록을 표현하기 위한 컬렉션 성격의 리워드입니다. 앱 내 유료 콘텐츠 잠금
          해제, 거래 기능, 금융 수익, 도박성 혜택을 제공하지 않습니다.
        </p>
      </LegalSection>
    </LegalDocumentPage>
  )
}

export const metadata: Metadata = {
  title: '지원',
  description: 'OpenRun 지원 및 문의',
}
