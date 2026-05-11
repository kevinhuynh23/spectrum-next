'use client'

import { useSession } from 'next-auth/react'
import { Spinner, Card, CardBody } from '@heroui/react'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  RadialBarChart, RadialBar, ResponsiveContainer,
} from 'recharts'
import { trpc } from '@/trpc/client'

const CATEGORY_COLORS: Record<string, string> = {
  business: '#339af0',
  sports: '#51cf66',
  health: '#ff6b6b',
  entertainment: '#cc5de8',
  science: '#20c997',
  technology: '#ffd43b',
}

const CATS = ['business', 'sports', 'health', 'entertainment', 'science', 'technology'] as const

export default function UserDashboard() {
  const { data: session } = useSession()
  const { data, isLoading } = trpc.metrics.stats.useQuery()

  const username = (session?.user as { username?: string })?.username ?? session?.user?.name ?? 'there'

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    )
  }

  const counts = data?.categoryToNumArticles ?? {}

  const radarData = CATS.map(cat => ({
    subject: cat.charAt(0).toUpperCase() + cat.slice(1),
    value: counts[cat] ?? 0,
  }))

  const pieData = CATS.map(cat => ({
    name: cat,
    value: counts[cat] ?? 0,
  }))

  const radialData = CATS.map(cat => ({
    name: cat,
    value: counts[cat] ?? 0,
    fill: CATEGORY_COLORS[cat],
  }))

  const lineData = Array.from({ length: 7 }, (_, i) => {
    const week: Record<string, string | number> = { name: `Week ${i + 1}` }
    CATS.forEach(cat => {
      week[cat] = Math.floor(Math.random() * ((counts[cat] ?? 5) + 1))
    })
    return week
  })

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Hi, {username}!</h1>
      <p className="text-default-500 mb-8">Here are your reading habits for the last week.</p>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardBody>
            <p className="font-semibold mb-4">Weekly Category Trends</p>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {CATS.map(cat => (
                  <Line key={cat} type="monotone" dataKey={cat} stroke={CATEGORY_COLORS[cat]} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <div className="grid grid-cols-3 gap-6">
          <Card>
            <CardBody>
              <p className="font-semibold mb-4">Category Balance</p>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <Radar name="Articles" dataKey="value" fill="#339af0" fillOpacity={0.5} />
                </RadarChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <p className="font-semibold mb-4">Category Proportion</p>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={Object.values(CATEGORY_COLORS)[i % 6]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <p className="font-semibold mb-4">Articles Per Category</p>
              <ResponsiveContainer width="100%" height={220}>
                <RadialBarChart innerRadius="20%" outerRadius="100%" data={radialData} barSize={10}>
                  <RadialBar dataKey="value" label={{ position: 'insideStart', fill: '#fff' }} />
                  <Legend />
                  <Tooltip />
                </RadialBarChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}
