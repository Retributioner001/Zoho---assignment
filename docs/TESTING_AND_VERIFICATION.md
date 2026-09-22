# 5. Testing & Verification Matrix

This document outlines the **16 core test scenarios** used to validate the entire School Management System.

---

| Test Category | Test Case Description | Expected Result | Status |
| :--- | :--- | :--- | :--- |
| **Admissions** | 1. Create Lead enquiry | Lead record saved with Enquiry status | **PASSED** |
| **Admissions** | 2. Update Lead status to "Admission Confirmed" | Triggers Deluge to create Student record | **PASSED** |
| **Admissions** | 3. Verify Student ID generation | Student ID formatted as `STU-2026-XXX` generated | **PASSED** |
| **Admissions** | 4. Check initial Academic Enrollment | Enrollment created for active year & class | **PASSED** |
| **Academic History** | 5. Assign Student to Class/Section | Student linked to Class 10 Section A | **PASSED** |
| **Academic History** | 6. Move Student to next Academic Year | History preserves previous year records | **PASSED** |
| **Attendance** | 7. Add daily attendance log | Attendance percentage updated automatically | **PASSED** |
| **Attendance** | 8. Attempt duplicate attendance on same date | Deluge blocks save with validation error | **PASSED** |
| **Attendance** | 9. Verify Attendance Percentage formula | Calculated as `(Present / Total) * 100` | **PASSED** |
| **Examinations** | 10. Add exam result with valid marks | Obtained marks saved, % and Grade calculated | **PASSED** |
| **Examinations** | 11. Enter Obtained Marks > Max Marks | Deluge validation blocks invalid entry | **PASSED** |
| **Fees & Payments** | 12. Log fee payment installment | Outstanding fee recalculated (`Total - Paid`) | **PASSED** |
| **Fees & Payments** | 13. Verify payment status update | Status moves from `Pending` -> `Partially Paid` -> `Paid` | **PASSED** |
| **Risk Engine** | 14. Set Attendance < 75% | Risk status dynamically adds `Attendance Risk` badge | **PASSED** |
| **Creator Portal** | 15. Login as Parent A | Creator displays Rahul Doe's data ONLY | **PASSED** |
| **Creator Portal** | 16. Login as Parent B | Creator displays Anita Smith's data ONLY (Parent A isolated) | **PASSED** |
