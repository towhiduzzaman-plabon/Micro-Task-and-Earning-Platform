export type UserRole = 'worker' | 'buyer' | 'admin'

export interface User {
  _id?: string
  email: string
  name: string
  photoURL?: string
  role: UserRole
  coin: number
  createdAt?: Date
}

export interface Task {
  _id?: string
  task_title: string
  task_detail: string
  required_workers: number
  payable_amount: number
  completion_date: Date
  submission_info: string
  task_image_url: string
  buyer_email: string
  buyer_name: string
  createdAt?: Date
}

export interface Submission {
  _id?: string
  task_id: string
  task_title: string
  payable_amount: number
  worker_email: string
  worker_name: string
  buyer_name: string
  buyer_email: string
  submission_details: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt?: Date
}

export interface Withdrawal {
  _id?: string
  worker_email: string
  worker_name: string
  withdrawal_coin: number
  withdrawal_amount: number
  payment_system: string
  account_number: string
  status: 'pending' | 'approved' | 'rejected'
  withdraw_date: Date
  createdAt?: Date
}

export interface Payment {
  _id?: string
  buyer_email: string
  buyer_name: string
  coin_amount: number
  amount_paid: number
  payment_id: string
  createdAt?: Date
}

export interface Notification {
  _id?: string
  message: string
  toEmail: string
  actionRoute: string
  createdAt: Date
  read?: boolean
}



