import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MantineProvider } from '@mantine/core'
import { NewsCard } from '../components/NewsCard'

const mockArticle = {
  title: 'AI Breakthrough - TechCorp',
  description: 'Scientists develop new AI model.',
  url: 'https://example.com/article',
  urlToImage: null,
  publishedAt: new Date().toISOString(),
  source: { id: 'techcorp', name: 'TechCorp' },
}

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MantineProvider>{children}</MantineProvider>
)

describe('NewsCard', () => {
  it('renders article title', () => {
    render(
      <NewsCard article={mockArticle} category="technology" onRead={vi.fn()} />,
      { wrapper }
    )
    expect(screen.getByText('AI Breakthrough - TechCorp')).toBeInTheDocument()
  })

  it('shows Full Spectrum link only for headline category', () => {
    const { rerender } = render(
      <NewsCard article={mockArticle} category="headline" onRead={vi.fn()} />,
      { wrapper }
    )
    expect(screen.getByText(/full spectrum/i)).toBeInTheDocument()

    rerender(
      <MantineProvider>
        <NewsCard article={mockArticle} category="technology" onRead={vi.fn()} />
      </MantineProvider>
    )
    expect(screen.queryByText(/full spectrum/i)).not.toBeInTheDocument()
  })

  it('calls onRead when article link is clicked', () => {
    const onRead = vi.fn()
    render(
      <NewsCard article={mockArticle} category="technology" onRead={onRead} />,
      { wrapper }
    )
    screen.getByText('AI Breakthrough - TechCorp').click()
    expect(onRead).toHaveBeenCalledWith('technology', 'TechCorp')
  })
})
