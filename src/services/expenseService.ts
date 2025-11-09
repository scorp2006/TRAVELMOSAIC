import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Expense, CreateExpenseData, UpdateExpenseData, ExpenseSummary, Settlement } from '../types/expense';

const EXPENSES_COLLECTION = 'expenses';

// ==========================================
// EXPENSE CRUD OPERATIONS
// ==========================================

export async function createExpense(
  userId: string,
  tripId: string,
  data: CreateExpenseData
): Promise<string> {
  const expenseData = {
    ...data,
    tripId,
    createdBy: userId,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  const docRef = await addDoc(collection(db, EXPENSES_COLLECTION), expenseData);
  return docRef.id;
}

export async function getExpense(expenseId: string): Promise<Expense | null> {
  const docRef = doc(db, EXPENSES_COLLECTION, expenseId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  const data = docSnap.data();
  return {
    id: docSnap.id,
    ...data,
    date: data.date.toDate(),
    createdAt: data.createdAt.toDate(),
    updatedAt: data.updatedAt.toDate(),
  } as Expense;
}

export async function getExpensesByTrip(tripId: string): Promise<Expense[]> {
  // Simplified query - sort on client side to avoid index requirement
  const q = query(
    collection(db, EXPENSES_COLLECTION),
    where('tripId', '==', tripId)
  );

  const querySnapshot = await getDocs(q);
  const expenses: Expense[] = [];

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    expenses.push({
      id: doc.id,
      ...data,
      date: data.date.toDate(),
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    } as Expense);
  });

  // Sort on client side (descending by date)
  expenses.sort((a, b) => b.date.getTime() - a.date.getTime());

  return expenses;
}

export async function updateExpense(
  expenseId: string,
  data: UpdateExpenseData
): Promise<void> {
  const docRef = doc(db, EXPENSES_COLLECTION, expenseId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteExpense(expenseId: string): Promise<void> {
  const docRef = doc(db, EXPENSES_COLLECTION, expenseId);
  await deleteDoc(docRef);
}

export async function markExpensePaid(
  expenseId: string,
  userId: string
): Promise<void> {
  const expense = await getExpense(expenseId);
  if (!expense) throw new Error('Expense not found');

  const updatedSplits = expense.splitAmong.map((split) =>
    split.userId === userId ? { ...split, paid: true } : split
  );

  const docRef = doc(db, EXPENSES_COLLECTION, expenseId);
  await updateDoc(docRef, {
    splitAmong: updatedSplits,
    updatedAt: Timestamp.now(),
  });
}

// ==========================================
// EXPENSE ANALYSIS & SUMMARIES
// ==========================================

export function calculateExpenseSummary(
  expenses: Expense[],
  budget: number
): ExpenseSummary {
  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const budgetRemaining = budget - totalSpent;
  const percentageUsed = budget > 0 ? (totalSpent / budget) * 100 : 0;

  // Group by category
  const byCategory: { [key: string]: number } = {};
  expenses.forEach((expense) => {
    byCategory[expense.category] = (byCategory[expense.category] || 0) + expense.amount;
  });

  // Calculate balances per member
  const memberBalances: Map<string, { paid: number; owed: number; name: string }> = new Map();

  expenses.forEach((expense) => {
    // Add amount paid
    const payer = memberBalances.get(expense.paidBy) || { paid: 0, owed: 0, name: expense.paidByName };
    payer.paid += expense.amount;
    memberBalances.set(expense.paidBy, payer);

    // Add amounts owed
    expense.splitAmong.forEach((split) => {
      const member = memberBalances.get(split.userId) || { paid: 0, owed: 0, name: split.userName };
      member.owed += split.amount;
      memberBalances.set(split.userId, member);
    });
  });

  const byMember = Array.from(memberBalances.entries()).map(([userId, data]) => ({
    userId,
    userName: data.name,
    totalPaid: data.paid,
    totalOwed: data.owed,
    balance: data.paid - data.owed, // Positive = owed money, Negative = owes money
  }));

  return {
    totalSpent,
    budgetRemaining,
    percentageUsed,
    byCategory,
    byMember,
  };
}

export function calculateSettlements(
  memberBalances: ExpenseSummary['byMember']
): Settlement[] {
  const settlements: Settlement[] = [];

  // Separate creditors (positive balance) and debtors (negative balance)
  const creditors = memberBalances.filter((m) => m.balance > 0.01).map(m => ({ ...m }));
  const debtors = memberBalances.filter((m) => m.balance < -0.01).map(m => ({ ...m }));

  // Sort by absolute balance (largest first)
  creditors.sort((a, b) => b.balance - a.balance);
  debtors.sort((a, b) => a.balance - b.balance);

  let i = 0;
  let j = 0;

  while (i < creditors.length && j < debtors.length) {
    const creditor = creditors[i];
    const debtor = debtors[j];

    const amount = Math.min(creditor.balance, Math.abs(debtor.balance));

    if (amount > 0.01) {
      settlements.push({
        from: debtor.userId,
        fromName: debtor.userName,
        to: creditor.userId,
        toName: creditor.userName,
        amount: parseFloat(amount.toFixed(2)),
      });
    }

    creditor.balance -= amount;
    debtor.balance += amount;

    if (Math.abs(creditor.balance) < 0.01) i++;
    if (Math.abs(debtor.balance) < 0.01) j++;
  }

  return settlements;
}

export function splitExpenseEqually(
  amount: number,
  members: { userId: string; userName: string }[]
): { userId: string; userName: string; amount: number; paid: false }[] {
  const splitAmount = amount / members.length;

  return members.map((member) => ({
    userId: member.userId,
    userName: member.userName,
    amount: parseFloat(splitAmount.toFixed(2)),
    paid: false,
  }));
}

// ==========================================
// REAL-TIME LISTENERS FOR COLLABORATION
// ==========================================

export function subscribeToExpenses(
  tripId: string,
  onUpdate: (expenses: Expense[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  // Simplified query - sort on client side to avoid index requirement
  const q = query(
    collection(db, EXPENSES_COLLECTION),
    where('tripId', '==', tripId)
  );

  return onSnapshot(
    q,
    (querySnapshot) => {
      const expenses: Expense[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        expenses.push({
          id: doc.id,
          ...data,
          date: data.date.toDate(),
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        } as Expense);
      });
      // Sort on client side (descending by date)
      expenses.sort((a, b) => b.date.getTime() - a.date.getTime());
      onUpdate(expenses);
    },
    (error) => {
      console.error('Error in expenses subscription:', error);
      if (onError) onError(error);
    }
  );
}
