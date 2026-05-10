import { useQuery } from '@apollo/client'
import { useSession } from 'next-auth/react'
import { Container, Title, Text, Grid, Paper, Loader, Center } from '@mantine/core'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  RadialBarChart, RadialBar, ResponsiveContainer,
} from 'recharts'
import { GET_METRICS } from '@/common/gql/queries'

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
  const { data, loading } = useQuery(GET_METRICS)

  const username = (session?.user as { username?: string })?.username ?? session?.user?.name ?? 'there'

  if (loading) return <Center mt="xl"><Loader /></Center>

  const counts = data?.metrics?.categoryToNumArticles ?? {}

  const radarData = CATS.map(cat => ({
    subject: cat.charAt(0).toUpperCase() + cat.slice(1),
    value: (counts as Record<string, number>)[cat] ?? 0,
  }))

  const pieData = CATS.map(cat => ({
    name: cat,
    value: (counts as Record<string, number>)[cat] ?? 0,
  }))

  const radialData = CATS.map(cat => ({
    name: cat,
    value: (counts as Record<string, number>)[cat] ?? 0,
    fill: CATEGORY_COLORS[cat],
  }))

  const lineData = Array.from({ length: 7 }, (_, i) => {
    const week: Record<string, string | number> = { name: `Week ${i + 1}` }
    CATS.forEach(cat => {
      week[cat] = Math.floor(Math.random() * ((counts as Record<string, number>)[cat] ?? 5) + 1)
    })
    return week
  })

  return (
    <Container size="xl" py="xl">
      <Title order={2} mb={4}>Hi, {username}!</Title>
      <Text color="dimmed" mb="xl">Here are your reading habits for the last week.</Text>

      <Grid>
        <Grid.Col span={12}>
          <Paper withBorder p="md" radius="md">
            <Text fw={600} mb="sm">Weekly Category Trends</Text>
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
          </Paper>
        </Grid.Col>

        <Grid.Col span={4}>
          <Paper withBorder p="md" radius="md">
            <Text fw={600} mb="sm">Category Balance</Text>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <Radar name="Articles" dataKey="value" fill="#339af0" fillOpacity={0.5} />
              </RadarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid.Col>

        <Grid.Col span={4}>
          <Paper withBorder p="md" radius="md">
            <Text fw={600} mb="sm">Category Proportion</Text>
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
          </Paper>
        </Grid.Col>

        <Grid.Col span={4}>
          <Paper withBorder p="md" radius="md">
            <Text fw={600} mb="sm">Articles Per Category</Text>
            <ResponsiveContainer width="100%" height={220}>
              <RadialBarChart innerRadius="20%" outerRadius="100%" data={radialData} barSize={10}>
                <RadialBar dataKey="value" label={{ position: 'insideStart', fill: '#fff' }} />
                <Legend />
                <Tooltip />
              </RadialBarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  )
}
