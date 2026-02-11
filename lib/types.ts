export interface Category {
  id: string;
  name: string;
  type: 'expense' | 'income';
  icon: string;
  iconFamily: 'Ionicons' | 'MaterialIcons' | 'MaterialCommunityIcons' | 'Feather' | 'FontAwesome';
  color: string;
  subcategories: string[];
}

export interface Transaction {
  id: string;
  categoryId: string;
  subcategory: string;
  amount: number;
  tags: string[];
  note: string;
  account: string;
  date: string;
  createdAt: string;
}

export type TimePeriod = 'week' | 'month' | 'year';

export const DEFAULT_ACCOUNTS = ['Cash', 'Bank', 'Credit Card', 'Savings'];

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'food',
    name: 'Food',
    type: 'expense',
    icon: 'restaurant',
    iconFamily: 'MaterialIcons',
    color: '#FF6B6B',
    subcategories: ['Groceries', 'Dining Out', 'Coffee', 'Delivery', 'Snacks'],
  },
  {
    id: 'transport',
    name: 'Transport',
    type: 'expense',
    icon: 'directions-car',
    iconFamily: 'MaterialIcons',
    color: '#4ECDC4',
    subcategories: ['Gas', 'Public Transit', 'Uber/Lyft', 'Parking', 'Maintenance'],
  },
  {
    id: 'shopping',
    name: 'Shopping',
    type: 'expense',
    icon: 'shopping-bag',
    iconFamily: 'Feather',
    color: '#A78BFA',
    subcategories: ['Clothing', 'Electronics', 'Home', 'Gifts', 'Other'],
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    type: 'expense',
    icon: 'movie',
    iconFamily: 'MaterialIcons',
    color: '#F59E0B',
    subcategories: ['Movies', 'Games', 'Concerts', 'Sports', 'Streaming'],
  },
  {
    id: 'health',
    name: 'Health',
    type: 'expense',
    icon: 'heart',
    iconFamily: 'Ionicons',
    color: '#EC4899',
    subcategories: ['Doctor', 'Pharmacy', 'Gym', 'Insurance', 'Wellness'],
  },
  {
    id: 'bills',
    name: 'Bills',
    type: 'expense',
    icon: 'receipt',
    iconFamily: 'MaterialIcons',
    color: '#06B6D4',
    subcategories: ['Rent', 'Utilities', 'Internet', 'Phone', 'Subscriptions'],
  },
  {
    id: 'education',
    name: 'Education',
    type: 'expense',
    icon: 'school',
    iconFamily: 'MaterialIcons',
    color: '#8B5CF6',
    subcategories: ['Tuition', 'Books', 'Courses', 'Supplies', 'Tutoring'],
  },
  {
    id: 'salary',
    name: 'Salary',
    type: 'income',
    icon: 'account-balance-wallet',
    iconFamily: 'MaterialIcons',
    color: '#34C759',
    subcategories: ['Monthly', 'Bonus', 'Commission', 'Overtime'],
  },
  {
    id: 'freelance',
    name: 'Freelance',
    type: 'income',
    icon: 'laptop',
    iconFamily: 'MaterialIcons',
    color: '#10B981',
    subcategories: ['Project', 'Consulting', 'Contract', 'Side Gig'],
  },
  {
    id: 'investment',
    name: 'Investment',
    type: 'income',
    icon: 'trending-up',
    iconFamily: 'Feather',
    color: '#0EA5E9',
    subcategories: ['Stocks', 'Dividends', 'Crypto', 'Interest', 'Rental'],
  },
];
