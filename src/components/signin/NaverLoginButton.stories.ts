import type { Meta, StoryObj } from '@storybook/react'
import NaverLoginButton from './NaverLoginButton'

export default {
  title: 'components/shared/NaverLoginButton',
  component: NaverLoginButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof NaverLoginButton>

type Story = StoryObj<typeof NaverLoginButton>
export const Default: Story = {}
