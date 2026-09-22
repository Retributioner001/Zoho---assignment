# Zoho EduSuite OS — Enterprise School Management System

[![Verification Test Suite](https://img.shields.io/badge/Verification%20Tests-16%2F16%20PASSED-success?style=for-the-badge&logo=checkmarx)](docs/TESTING_AND_VERIFICATION.md)
[![Platform Stack](https://img.shields.io/badge/Platform-Zoho%20CRM%20%7C%20Zoho%20Creator%20%7C%20Deluge-0f62fe?style=for-the-badge&logo=zoho)](docs/SYSTEM_OVERVIEW.md)
[![Submission Report](https://img.shields.io/badge/Final%20Report-assignment.pdf-e42528?style=for-the-badge&logo=adobeacrobatreader)](assignment.pdf)
[![Data Model](https://img.shields.io/badge/Data%20Model-13%20Custom%20Modules-10b981?style=for-the-badge)](schema/data_model.json)

> **Enterprise School Management Architecture & Deluge Automation Suite**  
> Built using a hybrid Zoho Ecosystem architecture: **Zoho CRM** as the central administrative Source of Truth + **Zoho Creator** as the secure, lightweight Parent Portal + **Deluge Scripting Engine** for real-time workflows and multi-dimensional risk monitoring.

---

## 📄 Final Submission Report

The official comprehensive project report is generated and available in the root directory:
👉 **[Download / View `assignment.pdf`](assignment.pdf)** (Executive report covering architecture, 13 modules, 8 Deluge scripts, Creator RLS, screenshots, dashboards, and test audit).

---

## 🌟 Executive Highlights & Core Capabilities

1. **Pure Source-of-Truth CRM Architecture:**
   - 13 Custom CRM Modules with strict referential integrity, master-detail relationships, and composite key guards.
   - Eliminates data duplication in Zoho Creator by executing dynamic, real-time Deluge queries (`zoho.crm.searchRecords`).

2. **Immutable Academic History Preservation:**
   - Solved the historical data mutation challenge where static student grade fields overwrite previous years on promotion.
   - Implemented the `Student_Academic_Enrollments` junction entity preserving complete historical progression (e.g. `2024-25 Class 8` &rarr; `2025-26 Class 9` &rarr; `2026-27 Class 10`).

3. **8 Production-Grade Deluge Automation Scripts:**
   - **Auto Student ID:** Formatted as `STU-YYYY-XXX` with auto-indexing.
   - **Admission Conversion:** Converts prospective Leads to Students and creates enrollment records.
   - **Duplicate Attendance Guard:** Pre-save composite key validation (`Student_ID + Date`) blocking duplicate entries.
   - **Attendance % Formula:** Calculates cumulative `(Present Days / Total Days) * 100`.
   - **Auto Grading:** Enforces `Obtained <= Max Marks` and maps percentage to letter grades (`A+` to `F`).
   - **Fee Balance Calculator:** Aggregates payment receipts against fee schedules and updates payment status (`Paid`, `Partially Paid`, `Pending`).
   - **Tri-Factor Risk Alert Engine:** Simultaneous real-time evaluation of `Attendance Risk` (<75%), `Fee Pending` (>$0), and `Academic Risk` (<40%).
   - **Creator Parent API:** Authenticated data retrieval engine for parent self-service.

4. **Zero-Trust Parent Data Isolation (Row-Level Security):**
   - Automatically binds parent sessions via `zoho.loginuser`.
   - Guaranteed security boundary: Parent A (`john.doe@example.com`) CANNOT view or access Parent B (`sarah.smith@example.com`) child data.

5. **Automated 16-Scenario Verification Suite:**
   - Integrated test runner validating all critical operations with a **100% Pass Rate (16/16 Passed)**.

---

## 📐 System Architecture Diagram

```
+---------------------------------------------------------------------------------------------+
|                                    ZOHO CRM (Source of Truth)                               |
|                                                                                             |
|  [Leads] ---> (Admission Confirmed) ---> [Students Master] <---> [Academic Enrollments]     |
|                                                  |                         |                |
|                                                  +---> [Attendance]        +---> [Classes]  |
|                                                  +---> [Exam Results]      +---> [Sections] |
|                                                  +---> [Fee Payments]      +---> [Subjects] |
|                                                                            +---> [Teachers] |
|                                                                            +---> [Exams]    |
|                                                                            +---> [Fee Struc]|
+---------------------------------------------------------------------------------------------+
                                               ^
                                               | REST API v3 / Deluge CRM Tasks
                                               | zoho.crm.searchRecords(Parent_Email)
                                               v
+---------------------------------------------------------------------------------------------+
|                              ZOHO CREATOR (Secure Parent Portal)                            |
|                                                                                             |
|  * Authenticated Session: zoho.loginuser (Parent Email Context)                             |
|  * Row-Level Security (RLS): Parent A CANNOT query or view Parent B student data           |
|  * Real-Time Widgets: Child Profile, Daily Attendance Log, Exam Report Card, Fee Ledger    |
+---------------------------------------------------------------------------------------------+
```

---

## 🗄️ Zoho CRM Data Model (13 Custom Modules)

| # | Module Name | Type | Key Field / Unique Identifier | Business Purpose |
| :-: | :--- | :--- | :--- | :--- |
| 1 | **Leads** | Standard / Admission | Lead ID / Email | Captures prospective student enquiries prior to admission. |
| 2 | **Students** | Custom Master | `Student_ID` (`STU-YYYY-XXX`) | Master student entity storing personal and contact details. |
| 3 | **Academic_Years** | Custom Master | `Academic_Year_Name` (e.g. `2026-27`) | Defines official school calendar sessions. |
| 4 | **Classes** | Custom Master | `Class_Name` (e.g. `Class 10`) | Grade levels offered, assigned to Class Teachers. |
| 5 | **Sections** | Custom Master | `Section_Name` (e.g. `Section A`) | Class divisions with capacity limits. |
| 6 | **Subjects** | Custom Master | `Subject_Code` (e.g. `SUB-MTH-10`) | Courses curriculum taught across classes. |
| 7 | **Teachers** | Custom Master | `Employee_ID` (e.g. `EMP-101`) | Faculty directory storing qualifications & specialization. |
| 8 | **Student_Academic_Enrollments** | Custom Junction | Enrollment ID | **Junction:** Preserves annual student progression history. |
| 9 | **Attendance** | Custom Transaction | `Unique_Key` (`Student_ID_Date`) | Daily attendance logs with duplicate prevention. |
| 10 | **Examinations** | Custom Master | Exam ID | Assessment events linked to classes and academic years. |
| 11 | **Exam_Results** | Custom Transaction | Result ID | Student marks, auto percentage, and letter grading. |
| 12 | **Fee_Structure** | Custom Master | Fee Structure ID | Tuition, transport, and lab fee schedules. |
| 13 | **Payments** | Custom Transaction | `Transaction_ID` (e.g. `TXN-89012`) | Financial receipt ledger and balance recalculation. |

Detailed JSON schema available at: [`schema/data_model.json`](schema/data_model.json).

---

## ⚡ Deluge Automation Scripts Suite

| Script File | Target Module | Trigger Event | Primary Business Logic |
| :--- | :--- | :--- | :--- |
| [`01_generate_student_id.ds`](deluge/crm/01_generate_student_id.ds) | Students | On Create (Student_ID null) | Generates sequential ID: `STU-YYYY-XXX`. |
| [`02_convert_lead_to_student.ds`](deluge/crm/02_convert_lead_to_student.ds) | Leads | Status = "Admission Confirmed" | Converts Lead -> Student and creates initial enrollment record. |
| [`03_prevent_duplicate_attendance.ds`](deluge/crm/03_prevent_duplicate_attendance.ds) | Attendance | Before-Save Validation | Enforces composite key (`Student_ID + Date`) uniqueness. |
| [`04_calculate_attendance_percentage.ds`](deluge/crm/04_calculate_attendance_percentage.ds) | Attendance | After-Save of Attendance | Calculates `(Present / Total) * 100` and updates Student. |
| [`05_validate_and_grade_exam.ds`](deluge/crm/05_validate_and_grade_exam.ds) | Exam_Results | Before-Save / Marks Change | Validates `Obtained <= Max` and assigns grades `A+` to `F`. |
| [`06_calculate_fee_outstanding.ds`](deluge/crm/06_calculate_fee_outstanding.ds) | Payments | On Payment Record Create | Computes `Total Fee - Total Paid` and updates payment status. |
| [`07_student_risk_alert.ds`](deluge/crm/07_student_risk_alert.ds) | Students | Attendance / Fee / Exam Update | Tri-factor risk engine: `Attendance Risk`, `Fee Pending`, `Academic Risk`. |
| [`01_parent_portal_fetch.ds`](deluge/creator/01_parent_portal_fetch.ds) | Creator Portal | Page Load / API Sync | Authenticated parent data fetch using `zoho.loginuser`. |

---

## 📊 Automated 16-Scenario Verification Audit

| # | Category | Test Scenario Description | Expected Assertion | Status |
| :-: | :--- | :--- | :--- | :-: |
| **01** | Admissions | Create Lead Enquiry Record | Lead saved with status Enquiry | **PASSED** |
| **02** | Admissions | Update Lead to Admission Confirmed | Triggers Deluge Student Creation | **PASSED** |
| **03** | Admissions | Auto Student ID Generation | Formatted as `STU-YYYY-XXX` with unique index | **PASSED** |
| **04** | Admissions | Initial Academic Enrollment Link | Enrollment created for active academic year | **PASSED** |
| **05** | Academic History | Assign Student to Class/Section | Linked to Class 10 Section A | **PASSED** |
| **06** | Academic History | Preserve Annual Progress History | Junction entity preserves multi-year history | **PASSED** |
| **07** | Attendance | Log Daily Attendance | Attendance record created & % updated | **PASSED** |
| **08** | Attendance | Duplicate Attendance Guard | Deluge blocks duplicate for same date | **PASSED** |
| **09** | Attendance | Attendance % Formula Check | Accurate `(Present Days / Total Days) * 100` | **PASSED** |
| **10** | Examinations | Log Valid Exam Result | Obtained marks saved & letter grade calculated | **PASSED** |
| **11** | Examinations | Marks Boundary Guard (Obtained > Max) | Deluge blocks save when Obtained > Max Marks | **PASSED** |
| **12** | Fees & Payments | Process Fee Payment Installment | Outstanding balance updated (`Total - Paid`) | **PASSED** |
| **13** | Fees & Payments | Payment Status Transition | Transitions `Pending` -> `Partially Paid` -> `Paid` | **PASSED** |
| **14** | Risk Engine | Attendance Risk Trigger (< 75%) | Adds `Attendance Risk` badge automatically | **PASSED** |
| **15** | Creator Portal | Parent A Session Data Retrieval | Parent A accesses Rahul Doe ONLY | **PASSED** |
| **16** | Creator Portal | Parent B Session Isolation Test | Parent B accesses Anita Smith ONLY (Parent A blocked) | **PASSED** |

---

## 🖥️ Running the Interactive Web Platform Locally

The interactive web dashboard showcases all 5 views: CRM Console, Deluge Code Inspector, 1-Click Test Suite, Parent Portal, and Chart.js Analytics:

1. Clone or download this repository.
2. Open [`index.html`](index.html) directly in any modern browser (Chrome, Edge, Firefox, Safari).
3. Click through the navigation tabs to inspect live features:
   - **CRM Console:** Test lead admission conversion, view student directory with risk badges.
   - **Deluge Scripts:** View and inspect all 8 Deluge automation scripts with live execution trace.
   - **Test Suite:** Click **"Run All 16 Test Cases Live"** to observe real-time validation execution.
   - **Parent Portal:** Toggle between **Parent A** and **Parent B** to test row-level security isolation.
   - **Reports & Dashboard:** Review dynamic Chart.js visualizations for enrollment, fees, attendance, and risk.

---

## 📚 Technical Documentation Directory Map

Detailed technical markdown documentation is organized under the [`docs/`](docs/) directory:

- 📖 [`docs/SYSTEM_OVERVIEW.md`](docs/SYSTEM_OVERVIEW.md) — Architectural overview, stack rationale, and hybrid system design.
- 🗃️ [`docs/DATA_MODEL.md`](docs/DATA_MODEL.md) — 13 CRM modules specifications and historical junction architecture.
- ⚙️ [`docs/DELUGE_AUTOMATIONS.md`](docs/DELUGE_AUTOMATIONS.md) — Detailed guide to the 8 Deluge functions and business rules.
- 🔒 [`docs/CREATOR_INTEGRATION_AND_SECURITY.md`](docs/CREATOR_INTEGRATION_AND_SECURITY.md) — Zero-trust row-level security and session authentication.
- 🧪 [`docs/TESTING_AND_VERIFICATION.md`](docs/TESTING_AND_VERIFICATION.md) — 16-point test matrix and validation methodology.
- 📋 [`docs/SUBMISSION_CHECKLIST.md`](docs/SUBMISSION_CHECKLIST.md) — Comprehensive submission audit checklist.
- 🏆 [`docs/EXECUTIVE_PORTFOLIO.md`](docs/EXECUTIVE_PORTFOLIO.md) — Executive summary and architectural highlights.

---

## ⚖️ Legal & Trademark Notice

*Zoho CRM, Zoho Creator, and Deluge are registered trademarks of Zoho Corporation. This project has been developed independently for technical assignment and educational evaluation purposes.*
