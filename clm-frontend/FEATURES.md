# CLM Frontend - Complete Features Documentation

## Overview
The Contract Lifecycle Management (CLM) Frontend is a production-grade React/Next.js application built with TypeScript. It provides a comprehensive interface for managing contracts, templates, workflows, approvals, and more. All data is sourced from real backend APIs - **no mock data**.

---

## 🔐 Authentication Module

### 1. **User Authentication System**
**Location:** `/app/page.tsx` (Login Page)

**Features:**
- Email/Password login
- Bearer token-based authentication
- Automatic token refresh mechanism
- Session persistence via localStorage
- Error handling for invalid credentials

**How to Use:**
```
1. Navigate to http://localhost:3000
2. Enter your registered email and password
3. Click "Sign In"
4. System automatically stores access token and refresh token
5. User is redirected to /dashboard
```

**Technical Details:**
- Uses `AuthProvider` context for global state management
- Tokens stored in browser localStorage
- All subsequent API calls automatically include `Authorization: Bearer {token}` header
- Failed authentication returns error message with 401 status

---

### 2. **User Registration**
**Location:** `/app/register/page.tsx`

**Features:**
- Create new user accounts
- Email validation
- Password requirements validation
- Automatic login after successful registration
- Real-time field validation

**How to Use:**
```
1. Click "Create Account" link from login page
2. Enter email, full name, and password
3. Confirm password matches
4. Click "Register"
5. System creates account and logs you in automatically
```

**Validation Rules:**
- Email must be valid format
- Password must be at least 8 characters
- Name is required

---

### 3. **Password Reset Flow**
**Location:** `/app/forgot-password/page.tsx` → `/app/verify-otp/page.tsx` → `/app/reset-password/page.tsx`

**Features:**
- Multi-step password recovery
- OTP verification via email
- Password strength meter
- Token expiration handling

**How to Use:**
```
Step 1 - Forgot Password:
1. Click "Forgot Password?" on login page
2. Enter registered email
3. System sends OTP to email

Step 2 - Verify OTP:
1. Enter 6-digit OTP from email
2. Click "Verify"

Step 3 - Reset Password:
1. Enter new password with confirmation
2. View password strength indicator
3. Click "Reset Password"
4. Redirected to login
```

**Technical Details:**
- OTP sent via backend email service
- OTP expires after 10 minutes
- Password strength validated in real-time
- Uses Suspense boundary for dynamic search params

---

### 4. **OTP Verification (Multi-Purpose)**
**Location:** `/app/verify-otp/page.tsx`

**Supported OTP Types:**
1. **Email Verification OTP** - During registration
2. **Password Reset OTP** - For password recovery
3. **Login OTP** - For two-factor authentication

**How to Use:**
```
1. System displays OTP input field
2. Enter 6-digit code from email
3. Click "Verify OTP"
4. Proceed to next step based on flow
```

**Features:**
- Countdown timer (10 minutes)
- Resend OTP option
- Automatic redirection on verification
- Error messages for expired/invalid OTP

---

## 📋 Contract Management

### 1. **Dashboard**
**Location:** `/app/dashboard/page.tsx`

**Key Features:**
- **Real-time Contract Statistics**
  - Total contracts count
  - Breakdown by status (Draft, Pending, Approved, Rejected)
  - Visual cards with trend indicators
  
- **Recent Contracts Widget**
  - Shows last 5 recent contracts
  - Quick access to contract details
  - Status indicators with color coding
  
- **Sync Status Indicator**
  - Shows when data is being fetched
  - Last sync timestamp
  - Manual refresh button

**How to Use:**
```
1. Login to access dashboard
2. View statistics cards for contract overview
3. Click on recent contracts to view details
4. Use sidebar navigation for other sections
5. Click refresh button to update data
```

**Data Displayed:**
- User's full name greeting
- Total active contracts
- Contract status breakdown (pie chart compatible)
- Recent contracts list with:
  - Title
  - Status with color badge
  - Creation date
  - Contract value

---

### 2. **Contracts Listing & Management**
**Location:** `/app/contracts/page.tsx`

**Features:**
- **Advanced Search**
  - Real-time search by contract title
  - Search is case-insensitive
  - Instant filtering as you type

- **Status Filtering**
  - Filter by: All, Draft, In Review, Approved, Signed
  - Multiple filter combination possible
  - Visual status indicators

- **Sorting Options**
  - By Date (newest first)
  - By Value (highest first)
  - By Title (A-Z)
  - By Status

- **Contract List Display**
  - Contract title with status badge
  - Created date and last updated
  - Contract value
  - Quick action buttons
  - Pagination support

**How to Use:**
```
1. Navigate to Contracts section
2. Use search bar to find specific contracts
3. Click on status dropdown to filter
4. Select sort option from dropdown
5. Click contract title to view full details
6. Use action buttons for:
   - View contract
   - Edit contract
   - Download contract
   - Share contract
   - Archive contract
```

**Color Coding:**
- Draft: Gray
- In Review: Amber/Orange
- Approved: Green
- Signed: Blue

---

### 3. **Create New Contract**
**Location:** `/app/create-contract/page.tsx`

**Features:**
- **Contract Form**
  - Title (required)
  - Description (optional)
  - Contract type selection
  - Value input (optional)
  - Status selection (Draft/Pending)

- **Template Selection**
  - Choose from existing templates
  - Quick template copy to new contract
  - Template preview

- **Validation**
  - Real-time field validation
  - Required field indicators
  - Character limit warnings
  - Numeric value validation

- **Error Handling**
  - Clear error messages
  - Field-level validation feedback
  - Submission error handling

**How to Use:**
```
1. Click "New Contract" button from Contracts page
2. Fill in contract details:
   - Title: Enter contract name
   - Description: Add contract details (optional)
   - Type: Select from dropdown (Sales, Employment, etc.)
   - Value: Enter monetary value (optional)
3. Select template to use as base (optional)
4. Set initial status: Draft or Pending
5. Click "Create Contract"
6. System creates contract and redirects to details page
```

**Field Details:**
- **Title**: Required, max 255 characters
- **Description**: Optional, max 2000 characters
- **Value**: Optional, numeric input
- **Type**: Required, predefined list
- **Status**: Draft (for editing) or Pending (for review)

---

### 4. **Contract Templates**
**Location:** `/app/templates/page.tsx`

**Features:**
- **Template Library**
  - Browse all contract templates
  - Organized by category
  - Usage statistics per template
  - Template preview

- **Template Categories**
  - Sales Agreements 🤝
  - Employment 👥
  - NDAs 🔒
  - Service Agreements ⚙️
  - Procurement 📦
  - Legal Documents ⚖️
  - Partnership Agreements 🔗
  - Other 📄

- **View Modes**
  - Grid view (cards)
  - List view (table)
  - Toggle between views

- **Search & Filter**
  - Search by template name
  - Filter by category
  - Combination search + filter

- **Template Actions**
  - View template details
  - Create contract from template
  - Copy template
  - View merge fields
  - Download template

**How to Use:**
```
1. Click Templates in sidebar
2. View all available templates
3. Select category from filter dropdown
4. Use search box to find specific template
5. Switch between Grid/List view using toggle
6. Click on template card to view details
7. Click "Use Template" to create new contract
8. System pre-fills form with template data
```

**Template Information:**
- Template name and description
- Contract type
- Category/Classification
- Creation date
- Last update date
- Number of times used
- Available merge fields for personalization

---

## ⚙️ Workflow Management

### 1. **Workflows Page**
**Location:** `/app/workflows/page.tsx` (Component: `WorkflowsPage`)

**Features:**
- **Workflow Listing**
  - View all configured workflows
  - Status indicators (Active, Inactive, Archived)
  - Workflow steps visualization
  - Timeline view of workflow progression

- **Workflow Details**
  - Workflow name and description
  - Current status
  - All configured steps
  - Assignment information
  - Created date and last modified

- **Step Information**
  - Step number/sequence
  - Step name/action
  - Assigned users/roles
  - Required action type
  - Time estimates

- **Workflow Actions**
  - View full workflow
  - Edit workflow
  - Activate/Deactivate
  - Clone workflow
  - Archive workflow

**How to Use:**
```
1. Navigate to Workflows section
2. Browse list of all configured workflows
3. Click on workflow name to view details
4. View each step and assignments
5. Click "Edit" to modify workflow
6. Toggle "Active" to enable/disable
7. Use "Clone" to create similar workflow
8. Archive old workflows no longer needed
```

**Status Types:**
- **Active** (Green): Currently in use
- **Inactive** (Gray): Disabled but available
- **Archived** (Dark Gray): Historical, read-only

---

## ✅ Approvals Management

### 1. **Approvals Page**
**Location:** `/app/approvals/page.tsx`

**Features:**
- **Approval Requests List**
  - Pending approvals
  - Approved requests
  - Rejected requests
  - Archived approvals

- **Request Information**
  - Entity type (Contract, Template, Workflow)
  - Entity title/name
  - Requester name and contact
  - Priority level (Low, Normal, High)
  - Status with color coding
  - Request creation date

- **Approval Actions**
  - Approve request
  - Reject request
  - Request clarification/comment
  - View related entity

- **Filtering & Search**
  - Filter by status
  - Filter by priority
  - Filter by entity type
  - Search by requester or entity name

- **Comment/Notes**
  - Add approval comments
  - View request comments
  - Reason for rejection

**How to Use:**
```
1. Click "Approvals" in sidebar
2. View pending approval requests
3. Click on request to view details
4. Review entity details (contract, etc.)
5. To Approve:
   - Click "Approve" button
   - Add optional comment
   - Click "Confirm Approval"
6. To Reject:
   - Click "Reject" button
   - Provide rejection reason (required)
   - Click "Confirm Rejection"
```

**Priority Indicators:**
- **High** (Red): Urgent, requires immediate attention
- **Normal** (Yellow): Standard priority
- **Low** (Blue): Non-urgent, can wait

**Status Colors:**
- **Pending**: Amber/Orange badge
- **Approved**: Green badge
- **Rejected**: Red badge
- **Archived**: Gray badge

---

## 🔍 Search Functionality

### 1. **Global Search**
**Location:** `/app/search/page.tsx`

**Features:**
- **Multi-Entity Search**
  - Search contracts
  - Search templates
  - Search workflows
  - Search approvals
  - Search users

- **Search Capabilities**
  - Full-text search across titles, descriptions, content
  - Relevance scoring
  - Search result ranking
  - Highlighted matches

- **Advanced Filters**
  - Filter by entity type
  - Filter by creation date range
  - Filter by status
  - Filter by author/owner

- **Result Display**
  - Entity title and type
  - Content preview (relevant excerpt)
  - Relevance score percentage
  - Last modified date
  - Quick action buttons

**How to Use:**
```
1. Click Search in sidebar OR press Ctrl+K
2. Enter search query in search box
3. Results display in real-time
4. View search results sorted by relevance
5. Click on result to view full details
6. Use filters to narrow down results:
   - Entity Type: Choose what to search
   - Date Range: Filter by when created
   - Status: Filter by current status
7. Click result to navigate to entity
```

**Search Examples:**
- Search for contract titles: "NDA 2024"
- Search for content: "confidential terms"
- Search with filters: Type=Contract, Status=Approved

---

## 🔔 Notifications

### 1. **Notifications Center**
**Location:** `/app/notifications/page.tsx`

**Features:**
- **Notification Types**
  - Approval requests
  - Contract updates
  - Workflow completions
  - System alerts
  - User mentions

- **Notification Display**
  - Read/Unread status
  - Notification timestamp
  - Related entity link
  - Action buttons

- **Notification Actions**
  - Mark as read
  - Mark as unread
  - Clear notification
  - Take action (approve, review, etc.)

- **Notification Categories**
  - All notifications
  - Pending approvals
  - Contract updates
  - Workflow events
  - System messages

- **Filtering & Sorting**
  - Filter by type
  - Sort by date (newest first)
  - Show unread only
  - Archive old notifications

**How to Use:**
```
1. Click notification bell icon (top right)
2. View notification list
3. Click notification to view details and take action
4. Click "Mark as Read" to mark notification
5. Click "View" to navigate to related entity
6. Click "X" to dismiss notification
7. Use filters to view specific notification types
```

**Notification Badge:**
- Shows count of unread notifications
- Red indicator when you have unread messages

---

## 👤 User Profile & Settings

### 1. **User Profile**
**Location:** Accessible from top-right user menu

**Features:**
- **Profile Information**
  - Display user's full name
  - Email address
  - Tenant/Organization name
  - User ID
  - Account creation date

- **Profile Actions**
  - View profile details
  - Edit profile information
  - Change password
  - Update email

**How to Use:**
```
1. Click user avatar in top-right corner
2. Select "Profile" from dropdown
3. View your profile information
4. Click "Edit" to modify details
5. Click "Change Password" for security
6. Save changes
```

---

### 2. **User Logout**
**Location:** User menu (top-right)

**How to Use:**
```
1. Click user avatar in top-right
2. Click "Logout" or "Sign Out"
3. System clears tokens from localStorage
4. Redirected to login page
5. Session ended securely
```

**Security:**
- Clears all authentication tokens
- Clears user session
- Invalidates refresh tokens
- Redirects to public login page

---

## 🎯 Navigation & Sidebar

### 1. **Main Navigation Sidebar**
**Location:** Left sidebar on all authenticated pages

**Menu Items:**
1. **Dashboard** - Overview and statistics
2. **Contracts** - Contract management
3. **Templates** - Template library
4. **Workflows** - Workflow configuration
5. **Approvals** - Approval requests
6. **Search** - Global search
7. **Notifications** - Notification center

**Sidebar Features:**
- Toggle sidebar visibility (collapse/expand)
- Active page highlighting
- Icon + Text navigation
- Responsive design (collapses on mobile)
- Logo/Brand display at top

**How to Use:**
```
1. Click menu items to navigate between sections
2. Click hamburger icon to toggle sidebar
3. Current page is highlighted
4. Click on item to navigate
5. Sidebar persists across navigation
```

---

## 📊 Data & Statistics

### 1. **Real-time Data Sync**
**Features:**
- Auto-refresh on page load
- Manual refresh button available
- Last sync timestamp display
- Data fetched from live API
- Error handling with retry option

**How to Use:**
```
1. Data auto-loads when page opens
2. Click refresh button to update manually
3. View "Last synced" timestamp
4. If error occurs, click "Retry" button
```

---

## 🔒 Security Features

### 1. **Authentication & Authorization**
- **Token-based Authentication**
  - Bearer token in Authorization header
  - Automatic token refresh
  - Secure token storage

- **Session Management**
  - Session persistence
  - Automatic logout on token expiration
  - Logout with token clearance

- **Data Protection**
  - HTTPS encrypted connections
  - No plain-text password storage
  - Secure token transmission

---

### 2. **Access Control**
- **Protected Routes**
  - Authentication required for all app pages
  - Unauthenticated users redirected to login
  - Token validation on every request

- **User Isolation**
  - Users can only see their own data
  - Tenant-based data isolation
  - No cross-tenant data access

---

## 🎨 UI/UX Features

### 1. **Responsive Design**
- Mobile-friendly interface
- Tablet-compatible layouts
- Desktop-optimized views
- Sidebar collapse on mobile

### 2. **Color Coding**
- Status indicators with colors
- Category color differentiation
- Priority level colors
- Visual consistency

### 3. **Loading States**
- Skeleton loaders
- Progress indicators
- Loading spinners
- Syncing indicators

### 4. **Error Handling**
- User-friendly error messages
- Error recovery options
- Retry buttons
- Validation feedback

---

## 📱 API Integration

### 1. **ApiClient Class**
**Location:** `/app/lib/api-client.ts`

**Available Methods:**
```typescript
// Authentication
login(email: string, password: string)
register(userData: any)
refreshToken()
logout()

// Contracts
getContracts()
getContractDetails(id: string)
createContract(data: any)
updateContract(id: string, data: any)
deleteContract(id: string)

// Templates
getTemplates()
getTemplateDetails(id: string)
createTemplate(data: any)

// Workflows
getWorkflows()
getWorkflowDetails(id: string)

// Approvals
getApprovals()
createApproval(data: any)
updateApprovalStatus(id: string, status: string)

// Search
search(query: string)

// Notifications
getNotifications()
markNotificationAsRead(id: string)
```

**All endpoints connect to production API:**
```
Base URL: http://127.0.0.1:8000/
```

---

## 🚀 Getting Started

### 1. **First Time Setup**
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run production build
npm start
```

### 2. **First Login**
```
1. Open http://localhost:3000
2. Use test credentials or create new account
3. Successfully logged in → redirected to /dashboard
```

### 3. **Explore Features**
```
1. Dashboard → View contract overview
2. Contracts → Browse and manage contracts
3. Templates → View available templates
4. Create Contract → Create new contract
5. Workflows → View configured workflows
6. Approvals → Review pending approvals
7. Search → Search across all entities
8. Notifications → View all notifications
```

---

## ⚙️ Technical Stack

**Frontend Framework:** Next.js 16.1.1 with Turbopack
**Language:** TypeScript
**UI Styling:** Tailwind CSS
**State Management:** React Context API
**Authentication:** Bearer Token
**API Client:** Custom TypeScript ApiClient
**HTTP Client:** Fetch API
**Deployment:** Vercel-ready

---

## 📞 Support & Troubleshooting

### Common Issues:

1. **Login fails**
   - Check email is correct
   - Verify password is entered correctly
   - Check backend API is running

2. **Data not loading**
   - Check internet connection
   - Verify API token is valid
   - Try refreshing the page

3. **Session expired**
   - Login again
   - Clear browser cache
   - Check localStorage is enabled

---

## 🔗 Related Documentation

- API Backend Documentation: See backend repo
- Development Guide: See README.md
- Type Definitions: See /app/lib/api-client.ts

---

**Last Updated:** January 12, 2026
**Version:** 1.0.0
**Status:** Production Ready ✅
