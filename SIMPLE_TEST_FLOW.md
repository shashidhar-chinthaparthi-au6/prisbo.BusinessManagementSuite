# 🧪 Simple Test Flow - Complete Application

## 🚀 Quick Start

1. **Run Seed Data**: `node scripts/seed-complete.js`
2. **Start Server**: `npm run dev` (if not running)
3. **Login**: `admin@prisbo.com` / `admin123`

---

## 📋 Complete Test Flow (15 Minutes)

### **1. Login & Dashboard** (1 min)
- Login with admin credentials
- ✅ See dashboard with stats
- ✅ Check notification bell (top right)
- ✅ See recent activity

### **2. CRM - Customer Management** (3 min)
- Go to **Customers**
- ✅ See 5 sample customers
- Click customer name → **View detail page**
- ✅ See customer info, projects, activity history
- **Create new customer**: Add → Fill form → Create
- ✅ Success message appears
- ✅ Customer appears in list
- ✅ Activity logged

### **3. Projects & Tasks** (4 min)
- Go to **Projects**
- ✅ See 4 sample projects
- Click project name → **View detail page**
- ✅ See project info, tasks list, activity
- **Add task**: Click "Add Task" → Fill form → Create
- ✅ Task appears in list
- **Mark task complete**: Click circle icon
- ✅ Task marked as completed
- ✅ Activity logged

### **4. Team & Task Assignments** (2 min)
- Go to **Team**
- ✅ See 3 team members (Admin, Manager, User)
- Scroll to **Task Assignments**
- ✅ See tasks grouped by team member
- Click task → ✅ Navigate to project

### **5. Analytics** (2 min)
- Go to **Analytics** (Admin/Manager only)
- ✅ See metrics cards
- ✅ See charts (Pie, Bar, Line)
- ✅ Charts use Navy/Red colors only

### **6. Admin Section** (3 min)
- Click **Admin** in sidebar (Admin only)
- ✅ See admin dashboard with stats
- **User Management**: Click "Manage Users"
- ✅ See all users, can edit/delete
- **Demo Requests**: Click "Demo Requests"
- ✅ See demo requests with status
- Click "Manage" on a request
- ✅ Update status, add notes, schedule date

### **7. Notifications** (1 min)
- Click **notification bell** (top right)
- ✅ See notifications dropdown
- ✅ Unread count badge
- Click notification → ✅ Navigate to link
- ✅ Mark as read

### **8. Demo Request** (1 min)
- **Logout** → Go to home page
- Click **"Request Demo"**
- ✅ Demo form opens
- Fill form → Submit
- ✅ Success page appears
- **Login as admin** → Go to Admin → Demo Requests
- ✅ New request appears
- ✅ Notification created for admin

---

## ✅ Complete Checklist

### Core Features
- [ ] Login works
- [ ] Dashboard shows stats
- [ ] Customers: List, Create, View Detail, Activity History
- [ ] Projects: List, Create, View Detail, Tasks
- [ ] Tasks: Create, Update Status, Delete
- [ ] Team: View members, Task assignments
- [ ] Analytics: Charts display, Metrics correct

### Admin Features
- [ ] Admin dashboard accessible
- [ ] User management works
- [ ] Demo requests management works
- [ ] Can update demo request status
- [ ] Can add notes to demo requests

### Advanced Features
- [ ] Notifications appear in bell icon
- [ ] Notifications are clickable
- [ ] Can mark notifications as read
- [ ] Activity history shows for customers
- [ ] Activity history shows for projects
- [ ] Task assignments visible in team page

### Integration
- [ ] Create customer → Activity logged
- [ ] Create project → Activity logged
- [ ] Create task → Activity logged
- [ ] Demo request → Notification created
- [ ] All data persists in database

---

## 🎯 Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@prisbo.com | admin123 |
| Manager | manager@prisbo.com | manager123 |
| User | user@prisbo.com | user123 |

---

## 📊 Expected Data After Seed

- **3 Users**: Admin, Manager, User
- **5 Customers**: Various statuses
- **4 Projects**: Linked to customers
- **6 Tasks**: Across projects
- **3 Demo Requests**: Various statuses

---

## 🚨 Quick Test (5 min)

1. Login → Dashboard
2. Customers → Click customer → See detail
3. Projects → Click project → Add task → Mark complete
4. Team → See task assignments
5. Admin → Demo Requests → Manage one
6. Notification bell → Check notifications

**If all work → System is fully functional! ✅**
