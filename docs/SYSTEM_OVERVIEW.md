# 1. System Overview: School Management System

## Executive Summary

The **Zoho EduSuite OS** is an enterprise-grade School Management System designed using a hybrid Zoho Ecosystem architecture:
* **Zoho CRM**: Acts as the central, primary **Source of Truth** for all administrative operations, master data (Students, Teachers, Classes, Subjects), operational logs (Attendance, Exam Results), financial ledgers (Fee Structures, Payments), and automated workflows.
* **Zoho Creator**: Serves as the lightweight, secure, **Parent-Facing Application Portal**. Parents authenticate into Creator to view real-time data retrieved directly from Zoho CRM without duplicating master records.
* **Deluge Scripting**: Powers all business rules, field calculations, data validation guards, automated ID generation, risk scoring algorithms, and CRM-Creator integration.

---

## Architecture Diagram

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
|  * Logged-In Context: parent_email = zoho.loginuser                               |
|  * Row-Level Security: Retrieves ONLY student records linked to parent email      |
|  * Real-Time Widgets: Attendance Log, Exam Report Card, Outstanding Fees          |
+-----------------------------------------------------------------------------------+
```

---

## Architectural Rationale

### Why Zoho CRM as Source of Truth?
1. **Centralized Data Governance**: Standardizes entity definitions, access controls, audit logs, and operational workflows across administrative units.
2. **Scalable Relational Lookup**: Supports 1-to-Many and Many-to-Many relationships between Students, Academic Enrollment historical records, Attendance logs, Exams, and Payments.
3. **Native Workflow Engine**: Executes instant Deluge functions on record creation, modification, or field updates.

### Why Zoho Creator for Parent Portal?
1. **Separation of Concerns**: Prevents external parents from accessing internal CRM administrative backend settings.
2. **Custom Low-Code UI**: Delivers a simplified, mobile-responsive parent experience with customized dashboards.
3. **Zero Data Redundancy**: Creator queries CRM dynamically via Deluge API integrations rather than duplicating student database tables inside Creator.
