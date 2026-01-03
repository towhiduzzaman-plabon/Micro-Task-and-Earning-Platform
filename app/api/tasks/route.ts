import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { requireAuth, requireRole } from '@/middleware/auth'
import { Task } from '@/types'

export const GET = requireAuth(async (req, user) => {
  try {
    const db = await getDatabase()
    const { searchParams } = new URL(req.url)
    const buyerEmail = searchParams.get('buyerEmail')
    const requiredWorkers = searchParams.get('requiredWorkers')

    let query: any = {}

    // If buyer requests their own tasks, filter by their email
    if (buyerEmail === 'true' && user.role === 'buyer') {
      query.buyer_email = user.email
    } else if (buyerEmail) {
      query.buyer_email = buyerEmail
    }

    // For workers, only show tasks with available workers
    if (user.role === 'worker' || requiredWorkers === 'true') {
      query.required_workers = { $gt: 0 }
    }

    const tasks = await db.collection('tasks').find(query).sort({ completion_date: -1 }).toArray()

    const formattedTasks = tasks.map((task) => ({
      ...task,
      _id: task._id.toString(),
      completion_date: task.completion_date,
    }))

    return NextResponse.json(formattedTasks)
  } catch (error: any) {
    console.error('Get tasks error:', error)
    return NextResponse.json({ error: error.message || 'Failed to get tasks' }, { status: 500 })
  }
})

export const POST = requireRole(['buyer'])(async (req, user) => {
  try {
    const db = await getDatabase()
    const taskData = await req.json()

    const {
      task_title,
      task_detail,
      required_workers,
      payable_amount,
      completion_date,
      submission_info,
      task_image_url,
    } = taskData

    // Validate required fields
    if (
      !task_title ||
      !task_detail ||
      !required_workers ||
      !payable_amount ||
      !completion_date ||
      !submission_info
    ) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Calculate total payable amount
    const totalPayable = required_workers * payable_amount

    // Check if user has enough coins
    if (user.coin < totalPayable) {
      return NextResponse.json(
        { error: 'Insufficient coins. Please purchase more coins.' },
        { status: 400 }
      )
    }

    // Create task
    const newTask = {
      task_title,
      task_detail,
      required_workers: parseInt(required_workers),
      payable_amount: parseFloat(payable_amount),
      completion_date: new Date(completion_date),
      submission_info,
      task_image_url: task_image_url || '',
      buyer_email: user.email,
      buyer_name: user.name,
      createdAt: new Date(),
    }

    const result = await db.collection('tasks').insertOne(newTask)

    // Deduct coins from buyer
    await db.collection('users').updateOne(
      { email: user.email },
      { $inc: { coin: -totalPayable } }
    )

    return NextResponse.json({ success: true, taskId: result.insertedId.toString() })
  } catch (error: any) {
    console.error('Create task error:', error)
    return NextResponse.json({ error: error.message || 'Failed to create task' }, { status: 500 })
  }
})

