import Image from 'next/image'
import { Card, CardBody } from '@heroui/react'
import sources from '../../../public/VarietyOfSources.png'
import analytics from '../../../public/Analytics.png'
import categories from '../../../public/Categories.png'

const FEATURES = [
  { image: sources, alt: 'sources', title: 'Variety of Sources', description: 'Read from over 100 different sources and digest different perspectives.' },
  { image: analytics, alt: 'analytics', title: 'Analytics', description: 'Create an account and discover a personalized dashboard visualizing your reading habits.' },
  { image: categories, alt: 'categories', title: 'Categories', description: 'Widen your variety of news intake and draw from a range of categories.' },
]

const TEAM = [
  { name: 'Kevin Huynh', href: 'https://www.linkedin.com/in/kevinhuynh23/' },
  { name: 'Andrew Hwang', href: 'https://www.linkedin.com/in/andrewhwang10/' },
]

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center py-16">
        <h2 className="text-4xl font-bold mb-2">Widen your perspective.</h2>
        <h2 className="text-4xl font-bold text-default-500">Challenge your views.</h2>
      </div>

      <div className="bg-default-100 rounded-2xl p-10 mb-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Meet Spectrum</h2>
        <p className="text-default-600 max-w-2xl mx-auto leading-relaxed">
          Spectrum is a melting pot of different sources and types of news, all on one website.
          We challenge individuals to read from multiple sources and categories and encourage users
          to reflect on their personal reading habits. Our vision is to create a place where people
          can continuously develop a well-rounded understanding of current events in the world we live in.
        </p>
      </div>

      <h2 className="text-2xl font-bold mb-6">What makes us different</h2>
      <div className="grid grid-cols-3 gap-6 mb-12">
        {FEATURES.map(({ image, alt, title, description }) => (
          <Card key={title}>
            <CardBody className="text-center">
              <div className="flex justify-center mb-4">
                <Image src={image} alt={alt} width={100} height={100} />
              </div>
              <h3 className="font-semibold mb-2">{title}</h3>
              <p className="text-sm text-default-500">{description}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      <h2 className="text-2xl font-bold mb-6">Meet the team!</h2>
      <div className="grid grid-cols-2 gap-6">
        {TEAM.map(({ name, href }) => (
          <Card key={name}>
            <CardBody className="text-center py-8">
              <h3 className="font-semibold text-lg">
                <a href={href} target="_blank" rel="noopener noreferrer" className="hover:underline text-primary">
                  {name}
                </a>
              </h3>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  )
}
