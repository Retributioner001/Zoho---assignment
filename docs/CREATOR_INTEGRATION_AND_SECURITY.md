# 4. Zoho Creator Integration & Data Security

## Integration Strategy

Zoho Creator functions as the parent portal interface. Rather than creating duplicate database tables inside Creator for Students, Attendance, Results, and Fees, Creator uses Deluge CRM task integrations (`zoho.crm.searchRecords` / API v3) to dynamically pull real-time data from Zoho CRM.

---

## Workflow & Authentication Flow

```
[Parent Logs into Creator Portal]
              |
              v
[Deluge captures zoho.loginuser Email]
              |
              v
[Deluge executes searchRecords in CRM: (Parent_Email:equals:zoho.loginuser)]
              |
     +--------+--------+
     |                 |
(Record Found)    (Not Found)
     |                 |
     v                 v
[Returns Child     [Displays "Unauthorized
 JSON Data]         or No Linked Student"]
```

---

## Row-Level Security Enforcements

> [!CAUTION]
> **Data Privacy & Isolation**:
> A critical requirement of the system is ensuring **Parent A cannot see Parent B's child data under any circumstances**.

### Implementation Rules:
1. **No Broad Search Queries**: Creator pages never query all student records without an explicit `Parent_Email` filter.
2. **Context Parameter Binding**: The email context parameter is auto-injected from the verified session variable (`zoho.loginuser`), preventing manual URL parameter tampering.
3. **Multi-Parent Testing Matrix**:
   * `john.doe@example.com` -> Retrieves **Rahul Doe** (`STU-2026-001`) ONLY.
   * `sarah.smith@example.com` -> Retrieves **Anita Smith** (`STU-2026-002`) ONLY.
