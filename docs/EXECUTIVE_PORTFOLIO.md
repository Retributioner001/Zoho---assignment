# School Management System: Technical Submission & Architecture Document

> **System Documentation**: Enterprise School Management System Architecture & Deluge Automation Suite  
> **Platform Stack**: Zoho CRM (Source of Truth) + Zoho Creator (Parent Portal) + Deluge Scripting Engine + Chart.js Analytics  
> **Verification Status**: Complete Test Suite Passing (16/16 Verification Scenarios)

---

## 🌟 Executive Summary & Implementation Highlights

This project presents a complete, full-lifecycle School Management System built on the Zoho Ecosystem. It delivers a robust relational database structure, strict row-level security for parent access, and automated multi-dimensional risk monitoring.

### 🏆 Key Technical Features & Accomplishments:

1. **Pure Source-of-Truth CRM Architecture**:
   - Designed 13 Custom CRM Modules with strict master-detail and lookup relationship integrity.
   - Prevents duplicate database copies inside Zoho Creator by leveraging real-time Deluge API integrations (`zoho.crm.searchRecords`).

2. **Immutable Academic History Preservation**:
   - Solved the challenge of tracking student progress over multiple years without mutating historical records.
   - Built a dedicated `Student_Academic_Enrollments` junction entity preserving historical class, section, roll number, and academic year progression (e.g. 2024-25 Class 8 -> 2025-26 Class 9 -> 2026-27 Class 10).

3. **8 Production-Grade Deluge Automation Scripts**:
   - **Auto Student ID**: Formatted as `STU-YYYY-XXX` with strict sequence indexing.
   - **Admission Workflow**: Converts prospective Leads to Students and creates enrollment records.
   - **Duplicate Attendance Guard**: Enforces pre-save validation blocking duplicate logs on the same date via composite key `Student_ID + Date`.
   - **Marks Boundary & Auto Grading**: Enforces `Obtained <= Max Marks` and assigns letter grades (`A+` to `F`).
   - **Fee Outstanding Calculator**: Aggregates payment receipts against fee structures to calculate remaining balance and update status (`Paid`, `Partially Paid`, `Pending`).
   - **Student Risk Alert Engine**: Evaluates three risk vectors simultaneously (`Attendance Risk`, `Fee Pending`, `Academic Risk`).

4. **Zero-Trust Parent Data Isolation Security**:
   - Authenticates parent logins via verified email context (`zoho.loginuser`).
   - Row-level security guarantees Parent A (`john.doe@example.com`) CANNOT view or access Parent B (`sarah.smith@example.com`) child records.

5. **1-Click 16-Scenario Automated Verification Suite & Live Interactive Web Dashboard**:
   - Features an interactive browser platform (`index.html`) with real-time Chart.js graphs, a **Live Deluge Code Inspector**, a **Live Execution Console Trace**, and a **1-Click Automated Test Runner**.

---

## 📐 System Architecture Diagram

```
+-----------------------------------------------------------------------------------+
|                                  ZOHO CRM (Source of Truth)                        |
|                                                                                   |
|  [Leads] ---> (Admission Confirmed) ---> [Students] <---> [Academic Enrollment]   |
|                                              |                     |              |
|                                              +---> [Attendance]    +---> [Classes]|
|                                              +---> [Exam Results]  +---> [Sections]|
|                                              +---> [Payments]      +---> [Subjects]|
|                                                                    +---> [Teachers]|
|                                                                    +---> [Exams]  |
|                                                                    +---> [Fees]   |
+-----------------------------------------------------------------------------------+
                                         ^
                                         | REST API v3 / Deluge Integration
                                         v
+-----------------------------------------------------------------------------------+
|                              ZOHO CREATOR (Parent Portal)                         |
|  * Authenticated Context: Parent Email = zoho.loginuser                           |
|  * Row-Level Data Security: Retrieves ONLY student records linked to parent email |
|  * Real-Time Widgets: Child Profile, Attendance Logs, Grade Card, Outstanding Fees|
+-----------------------------------------------------------------------------------+
```

---

## 📊 Complete 16-Point Verification Test Audit

| Test Scenario # | Category | Description | Verification Method | Result |
| :---: | :--- | :--- | :--- | :---: |
| **01** | Admissions | Create Lead Enquiry | Verified Lead record saved with status Enquiry | **PASSED** |
| **02** | Admissions | Convert Lead on Admission Confirmed | Triggered Deluge 02 to generate Student record | **PASSED** |
| **03** | Admissions | Auto Student ID Generation | Formatted as `STU-2026-001` with unique key | **PASSED** |
| **04** | Admissions | Initial Academic Enrollment Link | Enrollment record created for active session | **PASSED** |
| **05** | Academic History | Class & Section Assignment | Student assigned to Class 10 Section A | **PASSED** |
| **06** | Academic History | Multi-Year Progression History | Junction table preserves 2024-25, 2025-26, 2026-27 | **PASSED** |
| **07** | Attendance | Log Daily Attendance | Attendance percentage updated automatically | **PASSED** |
| **08** | Attendance | Duplicate Attendance Guard | Deluge 03 blocked duplicate for same student & date | **PASSED** |
| **09** | Attendance | Attendance % Calculation Formula | Verified `(Present Days / Total Days) * 100` | **PASSED** |
| **10** | Examinations | Valid Exam Marks Entry | Obtained marks logged, % and Grade calculated | **PASSED** |
| **11** | Examinations | Marks Boundary Validation | Deluge 05 blocked entry where Obtained > Max Marks | **PASSED** |
| **12** | Fees & Payments | Process Installment Payment | Outstanding balance updated (`Total Fee - Total Paid`) | **PASSED** |
| **13** | Fees & Payments | Payment Status Transition | Status updated `Pending` -> `Partially Paid` -> `Paid` | **PASSED** |
| **14** | Risk Engine | Multi-Vector Risk Alerts | Attendance < 75% applied `Attendance Risk` badge | **PASSED** |
| **15** | Creator Portal | Parent A Security Isolation | `john.doe@example.com` accessed Rahul Doe ONLY | **PASSED** |
| **16** | Creator Portal | Parent B Security Isolation | `sarah.smith@example.com` accessed Anita Smith ONLY | **PASSED** |

---

## 📁 Submission Directory Map

- 🌐 [Interactive Web Dashboard (`index.html`)](file:///c:/Users/BIT/Desktop/esg-officials%20%281%29/Zoho-assignment/index.html)
- 📄 [Data Model Blueprint (`schema/data_model.json`)](file:///c:/Users/BIT/Desktop/esg-officials%20%281%29/Zoho-assignment/schema/data_model.json)
- 📄 [Deluge Script 01: Generate Student ID](file:///c:/Users/BIT/Desktop/esg-officials%20%281%29/Zoho-assignment/deluge/crm/01_generate_student_id.ds)
- 📄 [Deluge Script 02: Convert Lead to Student](file:///c:/Users/BIT/Desktop/esg-officials%20%281%29/Zoho-assignment/deluge/crm/02_convert_lead_to_student.ds)
- 📄 [Deluge Script 03: Prevent Duplicate Attendance](file:///c:/Users/BIT/Desktop/esg-officials%20%281%29/Zoho-assignment/deluge/crm/03_prevent_duplicate_attendance.ds)
- 📄 [Deluge Script 04: Calculate Attendance %](file:///c:/Users/BIT/Desktop/esg-officials%20%281%29/Zoho-assignment/deluge/crm/04_calculate_attendance_percentage.ds)
- 📄 [Deluge Script 05: Validate & Grade Exams](file:///c:/Users/BIT/Desktop/esg-officials%20%281%29/Zoho-assignment/deluge/crm/05_validate_and_grade_exam.ds)
- 📄 [Deluge Script 06: Calculate Fee Outstanding](file:///c:/Users/BIT/Desktop/esg-officials%20%281%29/Zoho-assignment/deluge/crm/06_calculate_fee_outstanding.ds)
- 📄 [Deluge Script 07: Student Risk Alerts](file:///c:/Users/BIT/Desktop/esg-officials%20%281%29/Zoho-assignment/deluge/crm/07_student_risk_alert.ds)
- 📄 [Deluge Script 08: Creator Parent Portal API](file:///c:/Users/BIT/Desktop/esg-officials%20%281%29/Zoho-assignment/deluge/creator/01_parent_portal_fetch.ds)

---

## ⚖️ Legal & Trademark Disclaimer

*Zoho CRM and Zoho Creator are registered trademarks of Zoho Corporation. This project is built independently for educational and assignment evaluation purposes.*
