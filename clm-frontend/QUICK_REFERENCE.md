# Quick Reference Guide

## Application URLs

| Page | URL | Purpose |
|------|-----|---------|
| Login | `http://localhost:3000` | User authentication |
| Register | `http://localhost:3000/register` | Create new account |
| Forgot Password | `http://localhost:3000/forgot-password` | Password recovery |
| Verify OTP | `http://localhost:3000/verify-otp` | OTP verification |
| Reset Password | `http://localhost:3000/reset-password` | Set new password |
| Dashboard | `http://localhost:3000/dashboard` | Overview & statistics |
| Contracts | `http://localhost:3000/contracts` | Contract list |
| Create Contract | `http://localhost:3000/create-contract` | New contract form |
| Templates | `http://localhost:3000/templates` | Template library |
| Workflows | `http://localhost:3000/workflows` | Workflow management |
| Approvals | `http://localhost:3000/approvals` | Approval requests |
| Search | `http://localhost:3000/search` | Global search |
| Notifications | `http://localhost:3000/notifications` | Notifications center |

---

## Quick Start Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Run tests
npm test

# Lint code
npm run lint
```

---

## Common Import Paths

```typescript
// Authentication
import { useAuth } from '@/app/lib/auth-context'

// API Client
import { ApiClient } from '@/app/lib/api-client'

// Types
import type { 
  Contract, 
  ContractTemplate, 
  ApprovalRequest,
  Notification,
  Workflow 
} from '@/app/lib/api-client'
```

---

## Authentication Flow

```
1. User navigates to /
2. Enters email and password
3. Clicks "Sign In"
4. System calls client.login()
5. Tokens stored in localStorage
6. Redirects to /dashboard
7. All subsequent requests use Authorization header
```

---

## Contract Lifecycle

```
Create → Draft → Pending → Review → Approved → Signed

Draft     = Created but not submitted
Pending   = Waiting for approval
Approved  = All approvals received
Signed    = Contract executed
```

---

## Data Flow in Components

```
Component Mounts
    ↓
Check Authentication (useEffect)
    ↓
Load Data from API (useEffect)
    ↓
Set State with Data
    ↓
Render Component with Data
    ↓
Handle User Interactions
    ↓
Update Data via API
    ↓
Refresh Component State
```

---

## API Client Methods Reference

```typescript
// Contracts
await client.getContracts()
await client.getContractDetails(id)
await client.createContract(data)
await client.updateContract(id, data)
await client.deleteContract(id)

// Templates
await client.getTemplates()
await client.getTemplateDetails(id)
await client.createTemplate(data)

// Workflows
await client.getWorkflows()
await client.getWorkflowDetails(id)

// Approvals
await client.getApprovals()
await client.createApproval(data)
await client.updateApprovalStatus(id, data)

// Search & Notifications
await client.search(query)
await client.getNotifications()
await client.markNotificationAsRead(id)

// Auth
await client.login(email, password)
await client.register(userData)
await client.logout()
```

---

## Error Handling Template

```typescript
try {
  const response = await client.method()
  
  if (!response.success) {
    setError(response.error || 'Operation failed')
    return
  }
  
  // Handle success
  setData(response.data)
} catch (error) {
  setError('An unexpected error occurred')
  console.error(error)
}
```

---

## Component Structure Template

```typescript
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/lib/auth-context'
import { ApiClient } from '@/app/lib/api-client'

export default function MyPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Protect route
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/')
    }
  }, [isLoading, isAuthenticated, router])

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        const client = new ApiClient()
        const response = await client.getContractDetails('id')
        if (response.success) {
          setData(response.data)
        } else {
          setError(response.error)
        }
      } catch (err) {
        setError('Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    if (isAuthenticated) loadData()
  }, [isAuthenticated])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return <div>{/* Your content */}</div>
}
```

---

## Common Patterns

### Search & Filter
```typescript
const [data, setData] = useState([])
const [searchQuery, setSearchQuery] = useState('')
const [filterStatus, setFilterStatus] = useState('all')
const [filteredData, setFilteredData] = useState([])

useEffect(() => {
  let filtered = [...data]
  
  if (filterStatus !== 'all') {
    filtered = filtered.filter(item => item.status === filterStatus)
  }
  
  if (searchQuery) {
    filtered = filtered.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }
  
  setFilteredData(filtered)
}, [data, searchQuery, filterStatus])
```

### Form Handling
```typescript
const [formData, setFormData] = useState({ title: '', status: 'draft' })
const [errors, setErrors] = useState({})

const handleChange = (e) => {
  const { name, value } = e.target
  setFormData(prev => ({ ...prev, [name]: value }))
}

const handleSubmit = async (e) => {
  e.preventDefault()
  const client = new ApiClient()
  const response = await client.createContract(formData)
  if (response.success) {
    router.push(`/contracts/${response.data.id}`)
  }
}
```

### Sidebar Toggle
```typescript
const [sidebarOpen, setSidebarOpen] = useState(true)

return (
  <div className="flex">
    <Sidebar open={sidebarOpen} />
    <main className="flex-1">
      <button onClick={() => setSidebarOpen(!sidebarOpen)}>
        Menu
      </button>
    </main>
  </div>
)
```

---

## Status Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | Success | Use response.data |
| 400 | Bad Request | Check input validation |
| 401 | Unauthorized | Redirect to login |
| 403 | Forbidden | Show permission error |
| 404 | Not Found | Show not found error |
| 500 | Server Error | Retry or show error |

---

## Browser DevTools Tips

### Check Network Requests
1. Open DevTools (F12)
2. Click "Network" tab
3. Make API call
4. Click request to see:
   - Request headers (includes Authorization)
   - Response status
   - Response body (JSON data)

### Check Local Storage
1. Open DevTools
2. Application → Local Storage
3. Check tokens:
   - `access_token` (Bearer token)
   - `refresh_token` (Refresh token)

### Console Debugging
```javascript
// Check auth state
localStorage.getItem('access_token')

// Clear tokens
localStorage.removeItem('access_token')
localStorage.removeItem('refresh_token')

// Check API response
fetch('http://127.0.0.1:8000//api/contracts', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
  }
}).then(r => r.json()).then(console.log)
```

---

## Tailwind CSS Quick Classes

```typescript
// Spacing
p-4 m-2 px-6 py-3 gap-4 space-y-2

// Typography
text-sm text-base text-lg font-medium font-bold

// Colors
bg-blue-50 text-blue-600 border-blue-200
hover:bg-gray-100

// Layout
flex flex-col gap-4
grid grid-cols-3 gap-4
w-full h-screen

// Responsive
md:grid-cols-2 lg:grid-cols-3

// Borders & Shadows
border rounded-lg shadow-md
```

---

## File Structure

```
clm-frontend/
├── app/
│   ├── lib/
│   │   ├── api-client.ts       # API client class
│   │   └── auth-context.tsx    # Auth provider & hook
│   ├── components/
│   │   ├── Sidebar.tsx         # Navigation sidebar
│   │   ├── DashboardContent.tsx
│   │   └── ...
│   ├── dashboard/
│   │   └── page.tsx            # Dashboard page
│   ├── contracts/
│   │   └── page.tsx            # Contracts list
│   ├── templates/
│   │   └── page.tsx            # Templates list
│   ├── approvals/
│   │   └── page.tsx            # Approvals list
│   ├── search/
│   │   └── page.tsx            # Search page
│   ├── create-contract/
│   │   └── page.tsx            # Create contract form
│   ├── page.tsx                # Login page
│   ├── layout.tsx              # Root layout
│   └── globals.css             # Global styles
├── public/                      # Static assets
├── package.json
├── tsconfig.json
└── next.config.ts
```

---

## Environment Variables

**.env.local:**
```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/
```

---

## Feature Checklist

- [x] User Authentication (Login/Register)
- [x] Password Recovery Flow
- [x] Dashboard with Statistics
- [x] Contract Management
- [x] Template Library
- [x] Workflow Management
- [x] Approval Requests
- [x] Global Search
- [x] Notifications Center
- [x] User Profile
- [x] Real API Integration
- [x] Type-safe API Client
- [x] Error Handling
- [x] Loading States
- [x] Responsive Design

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Page shows "Loading..." forever | Check authentication, verify isLoading useEffect |
| API calls fail with 401 | Check token in localStorage, re-login |
| Data not displaying | Check API response structure, add console logs |
| Styling not applied | Check Tailwind CSS is loaded, clear cache |
| Form validation not working | Verify validateForm() function is called |
| Sidebar doesn't toggle | Check useState for sidebarOpen state |
| Search not working | Check search query length, verify API endpoint |
| Notifications not updating | Implement auto-refresh interval with useEffect |

---

## Useful Links

- **Frontend**: http://localhost:3000
- **API Documentation**: `/API_USAGE.md`
- **Component Guide**: `/DEVELOPMENT_GUIDE.md`
- **Feature Documentation**: `/FEATURES.md`
- **Next.js Docs**: https://nextjs.org/docs
- **TypeScript Docs**: https://www.typescriptlang.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **React Docs**: https://react.dev

---

## Quick Debugging Checklist

- [ ] Check browser console for errors
- [ ] Verify tokens exist in localStorage
- [ ] Check Network tab in DevTools
- [ ] Verify API response structure
- [ ] Check useAuth hook is called
- [ ] Verify ApiClient method name
- [ ] Check component is wrapped in Suspense (if using search params)
- [ ] Verify error handling code
- [ ] Check loading state is set to false
- [ ] Verify route protection logic

---

**Last Updated:** January 12, 2026
**Quick Reference Version:** 1.0
**Status:** Production Ready ✅
