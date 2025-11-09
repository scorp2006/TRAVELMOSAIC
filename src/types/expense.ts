// Expense-related TypeScript interfaces

export interface Expense {
  id: string;
  tripId: string;
  title: string;
  amount: number;
  currency: string;
  category: 'accommodation' | 'transport' | 'food' | 'activity' | 'shopping' | 'other';
  date: Date;
  paidBy: string; // userId of person who paid
  paidByName: string;
  description?: string;
  receiptUrl?: string;
  splitType: 'equal' | 'custom' | 'full';
  splitAmong: ExpenseSplit[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExpenseSplit {
  userId: string;
  userName: string;
  amount: number;
  paid: boolean;
}

export interface CreateExpenseData {
  title: string;
  amount: number;
  currency: string;
  category: 'accommodation' | 'transport' | 'food' | 'activity' | 'shopping' | 'other';
  date: Date;
  paidBy: string;
  paidByName: string;
  description?: string;
  receiptUrl?: string;
  splitType: 'equal' | 'custom' | 'full';
  splitAmong: ExpenseSplit[];
}

export interface UpdateExpenseData {
  title?: string;
  amount?: number;
  category?: 'accommodation' | 'transport' | 'food' | 'activity' | 'shopping' | 'other';
  date?: Date;
  description?: string;
  receiptUrl?: string;
}

export interface ExpenseSummary {
  totalSpent: number;
  budgetRemaining: number;
  percentageUsed: number;
  byCategory: {
    [key: string]: number;
  };
  byMember: {
    userId: string;
    userName: string;
    totalPaid: number;
    totalOwed: number;
    balance: number;
  }[];
}

export interface Settlement {
  from: string;
  fromName: string;
  to: string;
  toName: string;
  amount: number;
}
