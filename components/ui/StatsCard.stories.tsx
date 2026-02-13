// components/ui/StatsCard.stories.tsx
// Storybook stories for StatsCard component
// Demonstrates 4 color variants with different trends

import type { Meta, StoryObj } from '@storybook/react'
import StatsCard from './StatsCard'

const meta = {
  title: 'UI/StatsCard',
  component: StatsCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['green', 'red', 'yellow', 'blue'],
      description: 'Color variant of the card'
    },
    trend: {
      control: 'select',
      options: ['up', 'down', 'neutral'],
      description: 'Trend direction indicator'
    },
    value: {
      control: 'text',
      description: 'The main numeric value to display'
    },
    label: {
      control: 'text',
      description: 'Label text below the value'
    }
  },
  decorators: [
    (Story) => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof StatsCard>

export default meta
type Story = StoryObj<typeof meta>

// Green variant with upward trend
export const GreenUp: Story = {
  args: {
    value: 42,
    label: 'Valide',
    variant: 'green',
    trend: 'up',
  },
}

// Red variant with downward trend
export const RedDown: Story = {
  args: {
    value: 8,
    label: 'Expirate',
    variant: 'red',
    trend: 'down',
  },
}

// Yellow variant with neutral trend
export const YellowNeutral: Story = {
  args: {
    value: 15,
    label: 'Expiră <30 zile',
    variant: 'yellow',
    trend: 'neutral',
  },
}

// Blue variant without trend
export const Blue: Story = {
  args: {
    value: 127,
    label: 'Total înregistrări',
    variant: 'blue',
  },
}

// All variants displayed together
export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4" style={{ width: '650px' }}>
      <StatsCard value={42} label="Valide" variant="green" trend="up" />
      <StatsCard value={8} label="Expirate" variant="red" trend="down" />
      <StatsCard value={15} label="Expiră <30 zile" variant="yellow" trend="neutral" />
      <StatsCard value={127} label="Total înregistrări" variant="blue" />
    </div>
  ),
}
