# 2. Data Model & Entity Specifications

## Overview of CRM Modules

The system comprises **13 Custom Modules** designed with strict relational constraints:

| Module Name | Type | Key Purpose | Primary / Unique Field |
| :--- | :--- | :--- | :--- |
| **Leads** | Standard / Admission | Prospective student enquiries | Lead ID / Email |
| **Students** | Custom Master | Primary student profile source of truth | `Student_ID` (`STU-YYYY-XXX`) |
| **Academic_Years** | Custom Lookup | Defines school sessions (e.g. 2026-27) | `Academic_Year_Name` |
| **Classes** | Custom Lookup | Grade levels offered (e.g. Class 10) | `Class_Name` |
| **Sections** | Custom Lookup | Class divisions (e.g. Section A) | `Section_Name` |
| **Subjects** | Custom Lookup | Academic courses taught | `Subject_Code` |
| **Teachers** | Custom Lookup | Instructor faculty directory | `Employee_ID` |
| **Student_Academic_Enrollments** | Custom Junction | Preserves historical annual class/section progression | Enrollment ID |
| **Attendance** | Custom Log | Daily student attendance logs | `Unique_Key` (`Student_ID_Date`) |
| **Examinations** | Custom Master | Scheduled exam events | Exam ID |
| **Exam_Results** | Custom Log | Individual student marks & grades | Result ID |
| **Fee_Structure** | Custom Master | Fee rates per Class & Academic Year | Fee Structure ID |
| **Payments** | Custom Transaction | Financial receipt ledger & balance calculation | `Transaction_ID` |

---

## Detailed Module Definitions

### 1. Leads (Admission Enquiries)
* `First_Name` (Text, Mandatory)
* `Last_Name` (Text, Mandatory)
* `Parent_Guardian_Name` (Text, Mandatory)
* `Phone` (Phone, Mandatory)
* `Email` (Email, Mandatory)
* `Student_DOB` (Date, Mandatory)
* `Previous_School` (Text)
* `Admission_Class` (Picklist: Class 1 to 12)
* `Admission_Status` (Picklist: `Enquiry`, `Document Verification`, `Admission Confirmed`, `Rejected`)

### 2. Students (Master Entity)
* `Student_ID` (Text, Unique, Auto-Generated `STU-YYYY-XXX`)
* `First_Name` (Text, Mandatory)
* `Last_Name` (Text, Mandatory)
* `Date_of_Birth` (Date, Mandatory)
* `Gender` (Picklist: Male, Female, Other)
* `Parent_Guardian_Name` (Text, Mandatory)
* `Parent_Email` (Email, Mandatory, Lookup key for Creator)
* `Parent_Phone` (Phone, Mandatory)
* `Admission_Date` (Date, Mandatory)
* `Admission_Status` (Picklist: Active, Graduated, Suspended)
* `Current_Enrollment` (Lookup -> `Student_Academic_Enrollments`)
* `Risk_Status` (Multiselect: `Normal`, `Attendance Risk`, `Fee Pending`, `Academic Risk`)
* `Attendance_Percentage` (Percent, Calculated by Deluge)
* `Total_Outstanding_Fee` (Currency, Calculated by Deluge)

### 3. Student Academic Enrollment (Historical Architecture)

> [!IMPORTANT]
> **Academic History Preservation**:
> Class and Section are **NOT** stored as static single values on the Student record. Instead, every academic year creates a new `Student_Academic_Enrollment` junction record linking:
> `Student` + `Academic Year` + `Class` + `Section` + `Roll Number`
> This ensures complete, immutable historical auditability across all years (e.g. 2024-25 Class 8 -> 2025-26 Class 9 -> 2026-27 Class 10).
