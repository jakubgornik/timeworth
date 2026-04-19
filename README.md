# Timeworth — Work Time Management Platform

[![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20TypeScript-61DAFB?logo=react)](#)
[![API](https://img.shields.io/badge/API-Node.js%20%2F%20NestJS-339933?logo=node.js)](#)
[![Database](https://img.shields.io/badge/Database-PostgreSQL-4169E1?logo=postgresql)](#)
[![Platform](https://img.shields.io/badge/Platform-Supabase-3ECF8E?logo=supabase&logoColor=white)](#)
[![ORM](https://img.shields.io/badge/ORM-Prisma-2D3748?logo=prisma)](#)
[![Storage](https://img.shields.io/badge/Storage-AWS%20S3-FF9900?logo=amazonaws&logoColor=white)](#)
[![Tests](https://img.shields.io/badge/Tests-Unit%20%7C%20E2E-success)](#)
[![Deploy](https://img.shields.io/badge/Deploy-Frontend%20Vercel%20%7C%20API%20Render-black)](#)
[![UI](https://img.shields.io/badge/UI-TailwindCSS%20%2B%20shadcn%2Fui-38B2AC?logo=tailwindcss&logoColor=white)](#)

Full-stack application for managing work time, attendance, and reporting.  
Built with a dedicated API, secure JWT authentication (with refresh token rotation), testing, optimized data flows, Amazon S3 file storage, and deep Supabase integration.

## Live Demo

https://www.timeworth.site

## Key Features

- JWT-based authentication with access + refresh token flow and token rotation
- Two independent secure user flows (employee vs organization manager)
- Timesheet/worklog management with validation and business rules
- Advanced data tables with sorting, multi-criteria filtering, search, and pagination
- Data import/export workflows
- Secure file upload and storage using Amazon S3
- Supabase usage for core backend platform capabilities
- Reusable custom components
- Fully responsive UX across desktop/tablet/mobile
- Caching and invalidation
- Role/permission-based access control for sensitive actions

## Architecture Overview

- **Frontend (SPA):** React + TypeScript + TailwindCSS
- **Backend API:** NestJS
- **Database:** PostgreSQL (Supabase)
- **Backend Platform Services:** Supabase
- **ORM:** Prisma
- **Storage:** Amazon S3
- **Auth:** JWT, refresh tokens, secure HTTP-only cookies
- **Deployment:** Frontend on Vercel, API on Render
