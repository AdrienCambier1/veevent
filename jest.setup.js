import '@testing-library/jest-dom'

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    const { priority, ...restProps } = props
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...restProps} />
  },
}))

// Mock Next.js Link component
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }) => {
    return <a href={href} {...props}>{children}</a>
  },
}))

// Mock the useSlugify hook
jest.mock('@/hooks/commons/use-slugify', () => ({
  useSlugify: jest.fn((text) => text.toLowerCase().replace(/\s+/g, '-').replace(/[éèêë]/g, 'e').replace(/[àâä]/g, 'a').replace(/[îï]/g, 'i').replace(/[ôö]/g, 'o').replace(/[ûüù]/g, 'u').replace(/[ç]/g, 'c')),
})) 