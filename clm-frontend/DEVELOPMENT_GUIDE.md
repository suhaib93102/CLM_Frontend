# Component Architecture & Development Guide

## Overview
This guide explains the component structure, patterns, and how to develop new features in the CLM Frontend.

---

## 1. Authentication Context

### Location
`/app/lib/auth-context.tsx`

### Purpose
Manages global authentication state and provides hooks for all components to access user information and auth functions.

### Usage
```typescript
import { useAuth } from '@/app/lib/auth-context'

export default function MyComponent() {
  const {
    user,              // Current logged-in user object
    isAuthenticated,   // Boolean: is user logged in?
    isLoading,         // Boolean: is auth check in progress?
    login,             // Function: login(email, password)
    register,          // Function: register(userData)
    logout,            // Function: logout()
  } = useAuth()

  if (isLoading) return <div>Loading...</div>
  
  if (!isAuthenticated) {
    return <div>Please log in</div>
  }

  return (
    <div>
      <p>Welcome, {user?.full_name}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

### User Object Structure
```typescript
{
  user_id: string      // Unique user identifier
  email: string        // User's email
  full_name: string    // User's full name
  tenant_id: string    // Organization/tenant ID
}
```

### Protected Routes Pattern
```typescript
export default function ProtectedPage() {
  const router = useRouter()
  const { isLoading, isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/')  // Redirect to login
    }
  }, [isLoading, isAuthenticated, router])

  return <YourPageContent />
}
```

---

## 2. API Client

### Location
`/app/lib/api-client.ts`

### Creating a New Instance
```typescript
const client = new ApiClient()
// or with custom base URL
const client = new ApiClient('https://custom-api.com')
```

### Making API Calls
```typescript
try {
  const response = await client.getContracts()
  
  if (response.success) {
    console.log('Contracts:', response.data)
  } else {
    console.error('Error:', response.error)
  }
} catch (error) {
  console.error('Request failed:', error)
}
```

### Available Methods

#### Contracts
```typescript
client.getContracts()                          // Get all contracts
client.getContractDetails(contractId)          // Get single contract
client.createContract(contractData)            // Create new contract
client.updateContract(contractId, data)        // Update contract
client.deleteContract(contractId)              // Delete contract
```

#### Templates
```typescript
client.getTemplates()                          // Get all templates
client.getTemplateDetails(templateId)          // Get single template
client.createTemplate(templateData)            // Create template
```

#### Workflows
```typescript
client.getWorkflows()                          // Get all workflows
client.getWorkflowDetails(workflowId)          // Get single workflow
```

#### Approvals
```typescript
client.getApprovals()                          // Get all approvals
client.createApproval(approvalData)            // Create approval request
client.updateApprovalStatus(approvalId, data)  // Approve or reject
```

#### Search & Notifications
```typescript
client.search(query)                           // Search across entities
client.getNotifications()                      // Get all notifications
client.markNotificationAsRead(notificationId)  // Mark as read
```

---

## 3. Page Component Pattern

### Basic Structure
```typescript
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/lib/auth-context'
import { ApiClient } from '@/app/lib/api-client'

export default function MyPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Protect route
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/')
    }
  }, [isLoading, isAuthenticated, router])

  // Load data
  useEffect(() => {
    if (!isAuthenticated) return

    const loadData = async () => {
      try {
        setLoading(true)
        const client = new ApiClient()
        const response = await client.getContractDetails('id')
        
        if (response.success) {
          setData(response.data)
          setError(null)
        } else {
          setError(response.error || 'Failed to load data')
        }
      } catch (err) {
        setError('An error occurred')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [isAuthenticated])

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Header onLogout={logout} user={user} />
        {/* Your content here */}
      </main>
    </div>
  )
}
```

---

## 4. Data Fetching Patterns

### Pattern 1: Simple Data Load
```typescript
useEffect(() => {
  const loadData = async () => {
    try {
      setLoading(true)
      const client = new ApiClient()
      const response = await client.getContracts()
      
      if (response.success && response.data) {
        setContracts(response.data)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (isAuthenticated) {
    loadData()
  }
}, [isAuthenticated])
```

### Pattern 2: Handling Nested Data
```typescript
const loadData = async () => {
  const response = await client.getContracts()
  
  let dataList = []
  if (response?.data) {
    if (Array.isArray(response.data)) {
      dataList = response.data
    } else if ((response.data as any)?.data && Array.isArray((response.data as any).data)) {
      dataList = (response.data as any).data
    }
  }
  
  setData(dataList || [])
}
```

### Pattern 3: Search and Filter
```typescript
useEffect(() => {
  let filtered = [...data]

  // Filter
  if (filterStatus !== 'all') {
    filtered = filtered.filter(item => item.status === filterStatus)
  }

  // Search
  if (searchQuery) {
    filtered = filtered.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  // Sort
  if (sortBy === 'date') {
    filtered.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  }

  setFilteredData(filtered)
}, [data, filterStatus, searchQuery, sortBy])
```

---

## 5. Form Handling Pattern

### Basic Form Component
```typescript
const [formData, setFormData] = useState({
  title: '',
  description: '',
  status: 'draft'
})
const [errors, setErrors] = useState<Record<string, string>>({})
const [loading, setLoading] = useState(false)

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value } = e.target
  setFormData(prev => ({
    ...prev,
    [name]: value
  }))
  // Clear error for this field
  if (errors[name]) {
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }))
  }
}

const validateForm = (): boolean => {
  const newErrors: Record<string, string> = {}
  
  if (!formData.title.trim()) {
    newErrors.title = 'Title is required'
  }
  if (formData.title.length > 255) {
    newErrors.title = 'Title must be less than 255 characters'
  }
  
  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  
  if (!validateForm()) return
  
  try {
    setLoading(true)
    const client = new ApiClient()
    const response = await client.createContract(formData)
    
    if (response.success) {
      router.push(`/contracts/${response.data.id}`)
    } else {
      setErrors({ submit: response.error || 'Failed to create contract' })
    }
  } catch (error) {
    setErrors({ submit: 'An error occurred' })
  } finally {
    setLoading(false)
  }
}

return (
  <form onSubmit={handleSubmit}>
    <div>
      <label>Title</label>
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleInputChange}
        className={errors.title ? 'border-red-500' : ''}
      />
      {errors.title && <span className="text-red-500">{errors.title}</span>}
    </div>
    
    <div>
      <label>Status</label>
      <select
        name="status"
        value={formData.status}
        onChange={handleInputChange}
      >
        <option value="draft">Draft</option>
        <option value="pending">Pending</option>
      </select>
    </div>
    
    {errors.submit && <div className="text-red-500">{errors.submit}</div>}
    
    <button type="submit" disabled={loading}>
      {loading ? 'Creating...' : 'Create Contract'}
    </button>
  </form>
)
```

---

## 6. Common UI Components

### Loading Spinner
```typescript
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
  </div>
)
```

### Error Message
```typescript
const ErrorMessage = ({ message }: { message: string }) => (
  <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
    <p className="font-medium">Error</p>
    <p>{message}</p>
  </div>
)
```

### Status Badge
```typescript
const StatusBadge = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    draft: 'bg-slate-100 text-slate-800',
    pending: 'bg-amber-100 text-amber-800',
    approved: 'bg-emerald-100 text-emerald-800',
    rejected: 'bg-red-100 text-red-800',
  }
  
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors[status] || colors.draft}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}
```

### Card Component
```typescript
const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
    {children}
  </div>
)
```

---

## 7. Creating a New Feature

### Step-by-Step Guide

#### 1. Create the Page File
```bash
mkdir -p app/my-feature
touch app/my-feature/page.tsx
```

#### 2. Set Up Basic Structure
```typescript
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/lib/auth-context'
import { ApiClient } from '@/app/lib/api-client'

export const metadata = {
  title: 'My Feature - CLM',
  description: 'My feature description'
}

export default function MyFeaturePage() {
  const router = useRouter()
  const { isAuthenticated, isLoading, logout } = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/')
    }
  }, [isLoading, isAuthenticated, router])

  return (
    <div className="flex h-screen">
      {/* Sidebar and main content */}
    </div>
  )
}
```

#### 3. Add Data Loading
```typescript
useEffect(() => {
  const loadData = async () => {
    try {
      const client = new ApiClient()
      const response = await client.getContractDetails('id')
      // Handle response
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (isAuthenticated) {
    loadData()
  }
}, [isAuthenticated])
```

#### 4. Add UI and Interactivity
```typescript
return (
  <div>
    {loading ? <LoadingSpinner /> : <YourContent />}
  </div>
)
```

#### 5. Add Navigation
Update `/app/components/Sidebar.tsx` to include your new feature in the navigation menu.

---

## 8. Type Definitions

### Response Structure
```typescript
interface ApiResponse<T = any> {
  success: boolean      // Operation successful?
  data?: T              // Response data
  error?: string        // Error message
  status: number        // HTTP status code
}
```

### Common Data Types
```typescript
interface Contract {
  id: string
  title: string
  description?: string
  status: 'draft' | 'pending' | 'approved' | 'rejected'
  created_at: string
  updated_at: string
  value?: number
  created_by?: string
}

interface ContractTemplate {
  id: string
  name: string
  contract_type: string
  description?: string
  merge_fields?: string[]
  status: string
}

interface ApprovalRequest {
  id: string
  entity_type: string
  entity_id: string
  requester_id: string
  status: 'pending' | 'approved' | 'rejected'
  priority?: 'low' | 'normal' | 'high'
  comment?: string
  created_at: string
}
```

---

## 9. Styling Guidelines

### Tailwind CSS Classes
```typescript
// Spacing
className="p-4 m-2 px-6 py-3"

// Colors
className="text-blue-600 bg-blue-50 border-blue-200"

// Layout
className="flex flex-col gap-4"
className="grid grid-cols-3 gap-4"

// Responsive
className="text-sm md:text-base lg:text-lg"

// Hover/Active States
className="hover:bg-gray-100 active:bg-gray-200"

// Animations
className="transition-all duration-300"
className="animate-spin"
```

### Status Color Scheme
```typescript
const statusColors = {
  draft: 'bg-slate-100 text-slate-800',
  in_review: 'bg-amber-100 text-amber-800',
  approved: 'bg-emerald-100 text-emerald-800',
  signed: 'bg-blue-100 text-blue-800',
  rejected: 'bg-red-100 text-red-800',
}
```

---

## 10. Best Practices

### ✅ Do's
1. **Always protect routes** with authentication check
2. **Handle errors gracefully** with user-friendly messages
3. **Show loading states** while fetching data
4. **Use TypeScript** for type safety
5. **Create reusable components** for common UI patterns
6. **Validate form inputs** before submission
7. **Handle API response structure** properly
8. **Use useEffect cleanup** for subscriptions

### ❌ Don'ts
1. **Don't hardcode API URLs** - use ApiClient
2. **Don't forget error handling** - always wrap API calls
3. **Don't make unnecessary API calls** - use proper dependencies
4. **Don't mutate state directly** - use setState
5. **Don't mix async logic in render** - use useEffect
6. **Don't forget loading states** - show feedback to users
7. **Don't store sensitive data in localStorage** - use httpOnly cookies
8. **Don't ignore TypeScript errors** - fix type issues

---

## 11. Testing Components

### Testing Login Flow
```typescript
// Navigate to http://localhost:3000
// Enter valid credentials
// Should redirect to /dashboard
```

### Testing Protected Routes
```typescript
// Try accessing /contracts without login
// Should redirect to /
```

### Testing API Integration
```typescript
// Check browser Network tab in DevTools
// Verify Authorization header contains Bearer token
// Check response status is 200 for successful calls
```

---

## 12. Debugging Tips

### Check Authentication State
```typescript
const { user, isAuthenticated } = useAuth()
console.log('Auth:', { user, isAuthenticated })
```

### Check API Responses
```typescript
const response = await client.getContracts()
console.log('API Response:', response)
```

### Check Browser Console
- Open DevTools (F12)
- Check Console tab for errors
- Check Network tab for API calls

### Check Tokens
```typescript
// In browser console
localStorage.getItem('access_token')
localStorage.getItem('refresh_token')
```

---

**Last Updated:** January 12, 2026
**Status:** Production Ready ✅
