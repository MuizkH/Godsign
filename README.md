# 🏙️ Samadhan — Smart City Issue Intelligence & Resolution Platform

**Samadhan** is an end-to-end civic intelligence platform designed to bridge the gap between citizens and municipal authorities by transforming complaint reporting into an accountable, automated, and trackable resolution pipeline.

It combines **geospatial duplicate detection**, **AI-assisted issue classification**, **multi-department workflow routing**, **automated SLA escalation**, **public transparency scorecards**, and **citizen verification** into a unified Smart City platform.

---

## 🌟 Key Features

### 📝 1. Smart Citizen Issue Reporting

- **Map-Based Reporting**: Citizens can pinpoint civic issues directly on an interactive map.
- **Evidence Uploads**: Citizens can attach images and supporting media to complaints.
- **Live Tracking**: Users can track issue status and view resolution progress.
- **Public Issue Visibility**: Civic incidents can be visualized geographically through the public issue map.

---

### 📍 2. Geospatial Duplicate Detection

- **Spatial Issue Detection**: Uses PostgreSQL + PostGIS to detect nearby issues.
- **Duplicate Prevention**: `ST_DWithin` identifies existing issues within a configurable geographic radius.
- **Temporal Filtering**: Recent complaints are considered when determining whether a new report belongs to an existing issue cluster.
- **Issue Support System**: Additional citizen reports can support an existing issue instead of creating duplicate departmental tickets.

This reduces duplicate complaints and helps municipal departments focus on the underlying civic problem rather than repeated reports.

---

### 🔀 3. Multi-Department Workflow Routing

Samadhan supports civic problems requiring coordination across multiple departments.

- **Rule-Based Routing**: Issue categories can be associated with multiple departments.
- **Primary & Supporting Departments**: Departments can receive different operational roles.
- **DAG-Based Workflows**: Work orders can depend on the completion of other work orders.
- **Inter-Department Transfers**: Staff can request formal reassignment of work orders with approval and audit tracking.
- **Parallel & Sequential Execution**: Multiple departments can work simultaneously or follow dependency-based execution.

---

### ⏱️ 4. Automated SLA Tracking & Escalation

- **SLA Policies**: Work orders have acknowledgment and resolution deadlines.
- **Background Worker**: `pg-boss` periodically checks active work orders for SLA breaches.
- **Tiered Escalation**: Overdue tasks can move through multiple escalation levels.
- **Notifications**: Administrators can receive alerts for approaching or breached deadlines.
- **Grace Periods**: Configurable SLA grace windows prevent premature escalation.

---

### ✅ 5. Transparent Resolution & Citizen Verification

- **Public Transparency Scorecard**: Displays municipal and departmental performance metrics.
- **Resolution Verification**: Citizens can confirm or dispute resolved issues.
- **Proof of Resolution**: Resolution evidence can be uploaded before administrative closure.
- **Reopen Pipeline**: Disputed issues can return to an active workflow for further action.
- **Audit History**: Important operational changes are recorded through append-only history records.

---

### 🤖 6. AI-Assisted Classification & Visual Verification

Samadhan integrates multimodal AI as an advisory layer for civic operations.

- **Issue Classification**: Citizen descriptions and uploaded images can be analyzed to recommend issue categories.
- **Priority Suggestions**: AI can assist with urgency and priority assessment.
- **Visual Verification**: Pre-resolution evidence can be compared against post-resolution proof.
- **AI Audit Logging**: AI operations can record model information, latency, token usage, and human acceptance or modification.

---

## 📁 Repository Structure

```text
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # Database schema and PostGIS definitions
│   │   └── migrations/            # Database migration history
│   ├── src/
│   │   ├── config/                # Environment configuration & validation
│   │   ├── jobs/                  # Background SLA workers
│   │   ├── modules/
│   │   │   ├── ai/                # AI classification & visual verification
│   │   │   ├── analytics/         # Department analytics
│   │   │   ├── auth/              # Authentication & sessions
│   │   │   ├── departments/       # Departments & routing rules
│   │   │   ├── issues/            # Issue lifecycle & deduplication
│   │   │   ├── notifications/     # SSE & email notifications
│   │   │   ├── publicTransparency/# Public transparency metrics
│   │   │   ├── sla/               # SLA evaluation & escalation
│   │   │   ├── uploads/           # Cloudinary upload handling
│   │   │   ├── users/              # User & jurisdiction management
│   │   │   └── workOrders/         # DAG workflows & transfers
│   │   ├── shared/                # Middleware, DB client & logging
│   │   ├── app.ts                 # Express application
│   │   └── server.ts               # Server entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/                   # Providers, routes & layouts
│   │   ├── features/
│   │   │   ├── admin/             # Administrative dashboards
│   │   │   ├── ai-assistant/      # AI analysis tools
│   │   │   ├── auth/              # Login & registration
│   │   │   ├── civic-map/         # Interactive civic map
│   │   │   ├── dashboard/         # Citizen dashboard
│   │   │   ├── issues/            # Issue reporting & tracking
│   │   │   ├── profile/           # User preferences
│   │   │   └── transparency/      # Public performance scorecards
│   │   ├── shared/                # Shared UI components & API client
│   │   └── main.tsx               # Frontend entry point
│   └── package.json
│
├── assets/                         # UI screenshots and project media
├── docs/                           # Architecture & technical documentation
├── api-documentation.md            # API reference
├── database-schema.md              # Database documentation
└── README.md                       # Project documentation
