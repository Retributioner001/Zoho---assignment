# 3. Deluge Automations & Business Logic Guide

## Overview of Automations

The system executes 8 core Deluge functions across CRM Workflows and Creator Integration:

```
+------------------------------------+---------------------------------------------------+
| Script Name                        | Primary Function & Business Logic                 |
+------------------------------------+---------------------------------------------------+
| 01_generate_student_id.ds          | Auto-generates unique Student ID STU-YYYY-XXX     |
| 02_convert_lead_to_student.ds      | Converts Enquiry Lead -> Student & Enrollment     |
| 03_prevent_duplicate_attendance.ds | Validates composite key (Student_ID + Date)      |
| 04_calculate_attendance_percentage.ds | Calculates (Present Days / Total Working Days) * 100 |
| 05_validate_and_grade_exam.ds      | Enforces Obtained <= Max Marks & assigns A+-F grade|
| 06_calculate_fee_outstanding.ds    | Calculates Total Fee - Total Paid = Outstanding   |
| 07_student_risk_alert.ds           | Dynamic multi-vector risk badging engine          |
| 01_parent_portal_fetch.ds          | Zoho Creator secure parent data fetching API      |
+------------------------------------+---------------------------------------------------+
```

---

## Technical Function Deep-Dives

### 1. Student Risk Alert Engine (`07_student_risk_alert.ds`)
Automatically evaluates three operational parameters whenever Attendance, Payments, or Marks update:
* **Attendance Risk**: Triggered if `Attendance_Percentage < 75.0%`.
* **Fee Pending**: Triggered if `Total_Outstanding_Fee > $0.00`.
* **Academic Risk**: Triggered if Average Exam Percentage across all subjects `< 40.0%`.

If no risk conditions are met, the status reverts to `Normal`.

### 2. Duplicate Attendance Guard (`03_prevent_duplicate_attendance.ds`)
Constructs an internal composite key formatted as `Student_ID + "_" + Date` (e.g. `STU-2026-001_2026-09-22`). Before saving a new attendance record, Deluge performs a pre-search query. If a matching key exists, execution halts and throws a validation error.

### 3. Exam Grading & Boundary Guard (`05_validate_and_grade_exam.ds`)
Verifies that `Obtained_Marks <= Maximum_Marks`. Automatically calculates percentage and assigns grades:
* `90% - 100%`: Grade **A+**
* `80% - 89.9%`: Grade **A**
* `70% - 79.9%`: Grade **B**
* `60% - 69.9%`: Grade **C**
* `50% - 59.9%`: Grade **D**
* `< 50%`: Grade **F**
