import type { Meta, StoryObj } from '@storybook/react'
import KakaoLoginButton from './KakaoLoginButton'

export default {
  title: 'components/shared/KakaoLoginButton',
  component: KakaoLoginButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof KakaoLoginButton>

type Story = StoryObj<typeof KakaoLoginButton>
export const Default: Story = {}
