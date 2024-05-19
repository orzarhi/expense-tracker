import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { expenses } from './routes/expenses'

const app = new Hono().basePath('/api')

app.use('*', logger())

app.get('/', (c) => c.text('Hono!'))

app.route('/expenses', expenses)

export default app