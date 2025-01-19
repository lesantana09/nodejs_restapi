import { it, beforeAll, afterAll, describe, expect, beforeEach } from 'vitest'
import { execSync } from 'node:child_process'
import { app } from '../src/app'
import request from 'supertest'

describe('Test Transactions Routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should user be able to create a new transaction', async () => {
    await request(app.server)
      .post('/transactions')
      .send({
        title: 'New Transaction',
        amount: 5000,
        type: 'debit'
      })
      .expect(201)
  })

  it('should user be able to list all transactions', async () => {

    let title = 'New Transaction'
    let amount = 5000
    let type = 'credit'

    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title,
        amount,
        type
      })

    const cookies = createTransactionResponse.headers['set-cookie']

    const listTransactionResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    expect(listTransactionResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: title,
        amount: amount,
      })
    ])
  })

  it('should user be able to get an especific transactions', async () => {

    let title = 'New Transaction'
    let amount = 5000
    let type = 'credit'

    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title,
        amount,
        type
      })
    
    const cookies = createTransactionResponse.headers['set-cookie']

    const listTransactionResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)
    
    const transactionId = listTransactionResponse.body.transactions[0].id

    const getTransactionResponse = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', cookies)
      .expect(200)
        

    expect(getTransactionResponse.body.transaction).toEqual(
      expect.objectContaining({
        title: title,
        amount: amount,
      })
    )
  })  

  it('should user be able to get transactions summary and result is correct', async () => {

    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'Credit Transaction',
        amount: 5000,
        type:  'credit'
      })

    const cookies = createTransactionResponse.headers['set-cookie']

    await request(app.server)
      .post('/transactions')
      .set('Cookie', cookies)
      .send({
        title: 'Debit Transaction',
        amount: 3000,
        type:  'debit'
      })    

    const summaryTransactionResponse = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies)
      .expect(200)
    
    expect(summaryTransactionResponse.body.summary).toEqual({ total: 2000 })
  })  
})




