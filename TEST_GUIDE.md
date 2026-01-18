# 🧪 Complete Test Guide - Prisbo Business Management Suite

## 🚀 Pre-Test Setup

### 1. Start the Development Server
```bash
npm run dev
```

### 2. Verify Server is Running
- Open browser: http://localhost:3000
- You should see the landing page

### 3. Login Credentials
- **Email**: `admin@prisbo.com`
- **Password**: `admin123`

---

## 📋 Complete Test Flow

### **SCENARIO 1: CRM Integration Flow** ✅

#### Step 1: Login
1. Click "Sign In" or go to http://localhost:3000/login
2. Enter credentials: `admin@prisbo.com` / `admin123`
3. Click "Sign In"
4. ✅ **Expected**: Redirected to Dashboard

#### Step 2: Create a Customer
1. From Dashboard, click "Add Customer" or go to `/customers`
2. Click "Add Customer" button
3. Fill in the form:
   - **Name**: `Acme Corporation`
   - **Email**: `contact@acme.com`
   - **Phone**: `+1-555-0100`
   - **Status**: `New`
   - **Notes**: `Potential enterprise client`
4. Click "Create Customer"
5. ✅ **Expected**: 
   - Success message: "Customer created successfully!"
   - Redirected to customers list
   - New customer appears in list

#### Step 3: Search and Filter Customers
1. In customers page, use search box
2. Type: `Acme`
3. ✅ **Expected**: Customer appears in results
4. Clear search, select status filter: `New`
5. ✅ **Expected**: Only customers with "New" status shown

#### Step 4: View Customer Detail & Activity History
1. Click on customer name: `Acme Corporation`
2. ✅ **Expected**: Customer detail page opens
3. Verify displayed information:
   - Name, email, phone
   - Status badge
   - Notes section
4. Check "Activity History" section (right sidebar)
5. ✅ **Expected**: 
   - Activity: "Customer Created"
   - Shows your name as creator
   - Timestamp displayed

#### Step 5: Edit Customer Status
1. Click "Edit Customer" button
2. Change status to: `Contacted`
3. Update notes: `Initial contact made via email`
4. Click "Update Customer"
5. ✅ **Expected**: 
   - Success message
   - Status updated in detail page
   - New activity logged: "Customer Updated"

#### Step 6: Verify Activity History Updated
1. Go back to customer detail page
2. Check Activity History section
3. ✅ **Expected**: 
   - Two activities visible
   - "Customer Created" (oldest)
   - "Customer Updated" (newest)
   - Both show your name and timestamps

---

### **SCENARIO 2: Project Tracking Flow** ✅

#### Step 7: Create Project from Customer Page
1. On customer detail page (`/customers/[id]`)
2. In "Projects" section, click "New Project"
3. ✅ **Expected**: Project form opens with customer pre-selected
4. Fill in project form:
   - **Project Name**: `Website Redesign`
   - **Description**: `Complete website redesign and development`
   - **Status**: `Pending`
   - **Due Date**: Select a future date
   - **Assign To**: Select your name (or leave unassigned)
5. Click "Create Project"
6. ✅ **Expected**: 
   - Success message
   - Project appears in customer's projects list
   - Activity logged: "Project Created"

#### Step 8: View Project Detail Page
1. Click on project name: `Website Redesign`
2. ✅ **Expected**: Project detail page opens
3. Verify displayed information:
   - Project name and description
   - Customer name (linked)
   - Due date
   - Status badge
   - Assigned team member (if assigned)

#### Step 9: Add Tasks to Project
1. On project detail page, in "Tasks" section
2. Click "Add Task" button
3. Fill in task form:
   - **Task Title**: `Design mockups`
   - **Description**: `Create initial design mockups for homepage`
   - **Priority**: `High`
   - **Due Date**: Select a date
   - **Assign To**: Select your name
4. Click "Create Task"
5. ✅ **Expected**: 
   - Task appears in tasks list
   - Task shows with status, priority, due date, assignee

#### Step 10: Add More Tasks
1. Add 2 more tasks:
   - **Task 2**: `Frontend Development` (Medium priority, assigned)
   - **Task 3**: `Content Review` (Low priority, unassigned)
2. ✅ **Expected**: All tasks visible in list

#### Step 11: Update Task Status
1. Click the circle icon next to a task
2. ✅ **Expected**: 
   - Task status changes to "Completed"
   - Checkmark icon appears
   - Task text becomes strikethrough
   - Activity logged: "Task Updated"

#### Step 12: Verify Project Activity History
1. Check "Project Activity" section (right sidebar)
2. ✅ **Expected**: 
   - "Project Created" activity
   - "Task Created" activities (3 tasks)
   - "Task Updated" activity (when you marked task complete)
   - All show your name and timestamps

#### Step 13: Update Project Status
1. Click "Edit Project" button
2. Change status to: `In Progress`
3. Click "Update Project"
4. ✅ **Expected**: 
   - Status badge updates
   - Activity logged: "Project Updated"

#### Step 14: Delete a Task
1. On project detail page, find a task
2. Click trash icon
3. Confirm deletion
4. ✅ **Expected**: 
   - Task removed from list
   - Activity logged: "Task Deleted"

---

### **SCENARIO 3: Team Collaboration Flow** ✅

#### Step 15: View Team Page
1. Click "Team" in sidebar
2. ✅ **Expected**: Team page opens
3. Verify:
   - Team members list (you should see yourself)
   - Your role displayed (Admin)
   - Activity log in sidebar

#### Step 16: View Task Assignments
1. Scroll down to "Task Assignments" section
2. ✅ **Expected**: 
   - Tasks grouped by assigned team member
   - Your name with assigned tasks count
   - Tasks show: title, project name, status, priority, due date

#### Step 17: Navigate from Task Assignment
1. Click on a task in task assignments
2. ✅ **Expected**: 
   - Navigates to project detail page
   - Project opens showing all tasks

#### Step 18: Verify Activity Log
1. On team page, check "Recent Activity" sidebar
2. ✅ **Expected**: 
   - Shows all recent activities
   - Customer, Project, and Task activities
   - User attribution for each
   - Timestamps displayed

---

### **SCENARIO 4: Analytics Dashboard Flow** ✅

#### Step 19: Access Analytics
1. Click "Analytics" in sidebar
2. ✅ **Expected**: Analytics dashboard opens (Admin/Manager access)

#### Step 20: Verify Metrics Cards
1. Check summary cards at top
2. ✅ **Expected**: 
   - Total Customers: Shows count
   - Total Projects: Shows count
   - Active Projects: Shows count
   - Completed Projects: Shows count
   - Team Members: Shows count

#### Step 21: Verify Charts
1. Check "Customers by Status" pie chart
2. ✅ **Expected**: 
   - Chart displays with Navy/Red colors only
   - Shows distribution of customer statuses
   - Percentages displayed

3. Check "Projects Over Time" line chart
4. ✅ **Expected**: 
   - Line chart shows project creation trends
   - Navy blue line
   - Monthly data points

5. Check "Customer Status Distribution" bar chart
6. ✅ **Expected**: 
   - Bar chart with Navy blue bars
   - Shows count per status

---

### **SCENARIO 5: Dashboard Overview Flow** ✅

#### Step 22: Return to Dashboard
1. Click "Dashboard" in sidebar
2. ✅ **Expected**: Dashboard opens

#### Step 23: Verify Dashboard Stats
1. Check stat cards
2. ✅ **Expected**: 
   - All cards clickable
   - Numbers match actual data
   - Icons display correctly

#### Step 24: Verify Recent Activity
1. Check "Recent Activity" section
2. ✅ **Expected**: 
   - Shows last 5 activities
   - All your actions visible
   - Proper formatting

#### Step 25: Test Quick Actions
1. Click "Add Customer" quick action
2. ✅ **Expected**: Navigates to new customer form
3. Go back to dashboard
4. Click "New Project" quick action
5. ✅ **Expected**: Navigates to new project form

---

### **SCENARIO 6: Complete Workflow Integration** ✅

#### Step 26: Create Complete Customer Journey
1. Create a new customer: `Tech Startup Inc`
2. Status: `New`
3. View customer detail
4. Create project: `Mobile App Development`
5. Add 3 tasks to project:
   - `UI/UX Design` (High priority)
   - `Backend API` (High priority)
   - `Testing` (Medium priority)
6. Assign tasks to yourself
7. Mark one task as complete
8. Update customer status to `Qualified`
9. Update project status to `In Progress`

#### Step 27: Verify Complete Integration
1. Go to customer detail page
2. ✅ **Expected**: 
   - Customer shows updated status
   - Project visible in projects list
   - Activity history shows all actions

3. Go to project detail page
4. ✅ **Expected**: 
   - All tasks visible
   - One task marked complete
   - Activity history shows task operations

5. Go to team page
6. ✅ **Expected**: 
   - Your tasks visible in assignments
   - All activities logged

7. Go to analytics
8. ✅ **Expected**: 
   - Updated metrics
   - Charts reflect new data

---

## ✅ Test Checklist

### CRM Features
- [ ] Create customer
- [ ] Edit customer
- [ ] Delete customer
- [ ] Search customers
- [ ] Filter by status
- [ ] View customer detail
- [ ] View customer activity history
- [ ] Create project from customer page

### Project Features
- [ ] Create project
- [ ] Edit project
- [ ] Delete project
- [ ] Filter projects by status
- [ ] View project detail
- [ ] View project activity history
- [ ] Link project to customer

### Task Features
- [ ] Create task
- [ ] Edit task status
- [ ] Delete task
- [ ] Assign task to team member
- [ ] Set task priority
- [ ] Set task due date
- [ ] Mark task as complete

### Team Features
- [ ] View team members
- [ ] View task assignments
- [ ] Navigate from task to project
- [ ] View activity logs

### Analytics Features
- [ ] Access analytics (Admin/Manager)
- [ ] View metrics cards
- [ ] View pie chart
- [ ] View line chart
- [ ] View bar chart

### Dashboard Features
- [ ] View statistics
- [ ] View recent activity
- [ ] Use quick actions
- [ ] Navigate from stat cards

---

## 🐛 Common Issues & Solutions

### Issue: Can't login
**Solution**: Run seed script: `node scripts/seed.js`

### Issue: No data showing
**Solution**: Create test data using the flows above

### Issue: Charts not displaying
**Solution**: Ensure you have data (customers/projects) created

### Issue: Activity history empty
**Solution**: Perform actions (create/edit/delete) to generate activities

---

## 📊 Expected Results Summary

After completing all scenarios, you should have:

- **2+ Customers** with different statuses
- **2+ Projects** linked to customers
- **5+ Tasks** across projects
- **20+ Activities** logged
- **Complete activity history** for customers and projects
- **Task assignments** visible in team page
- **Analytics charts** showing data
- **Dashboard** with real metrics

---

## 🎯 Success Criteria

✅ All features work end-to-end
✅ Data persists correctly
✅ Activities are logged
✅ Navigation works smoothly
✅ Forms validate properly
✅ Success messages appear
✅ Error handling works
✅ Search and filters function
✅ Charts display correctly
✅ Task management works
✅ Team assignments visible

**If all checkboxes pass, the application is fully functional! 🎉**
