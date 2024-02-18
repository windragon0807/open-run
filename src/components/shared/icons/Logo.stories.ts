import type { Meta, StoryObj } from '@storybook/react'
import Logo from './Logo'

export default {
  title: 'components/shared/icons/Logo',
  component: Logo,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof Logo>

type Story = StoryObj<typeof Logo>
export const Default: Story = {}
