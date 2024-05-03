import nextMDX from '@next/mdx'

import withSearch from './src/mdx/search.mjs'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
  images: {
    unoptimized: true,
  },
  env: {
    API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
}

export default withSearch(nextConfig)
