# ⚡ Quick Test Flow - 5 Minutes

## 🚀 Start Here

1. **Open**: http://localhost:3000
2. **Login**: `admin@prisbo.com` / `admin123`

---

## 🎯 Quick Test (5 Scenarios)

### 1️⃣ Create Customer → View Activity (2 min)
```
1. Go to Customers → Add Customer
2. Fill: Name="Test Corp", Email="test@test.com", Phone="123-456-7890", Status="New"
3. Create → Click customer name → Check Activity History
✅ Should see "Customer Created" activity
```

### 2️⃣ Create Project → Add Tasks (2 min)
```
1. On customer detail → New Project
2. Fill: Name="Test Project", Due Date=tomorrow, Status="Pending"
3. Create → Click project name
4. Add Task: "Test Task 1" (High priority)
5. Add Task: "Test Task 2" (Medium priority)
✅ Should see 2 tasks, can mark complete
```

### 3️⃣ Check Team Task Assignments (1 min)
```
1. Go to Team page
2. Scroll to "Task Assignments"
✅ Should see your tasks grouped by your name
```

### 4️⃣ View Analytics (1 min)
```
1. Go to Analytics
2. Check charts and metrics
✅ Should see data in charts (Navy/Red colors only)
```

### 5️⃣ Dashboard Overview (1 min)
```
1. Go to Dashboard
2. Check stats and recent activity
✅ Should see all your actions in activity feed
```

---

## ✅ Success Indicators

- ✅ Customer created → Activity logged
- ✅ Project created → Linked to customer
- ✅ Tasks created → Visible in project
- ✅ Tasks assigned → Visible in team page
- ✅ Activities tracked → Visible everywhere
- ✅ Charts display → With data

**If all work → System is fully functional! 🎉**
