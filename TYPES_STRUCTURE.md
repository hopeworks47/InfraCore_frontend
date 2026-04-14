# Types Organization Structure

## Overview
All type definitions have been centralized in the `types/` directory for better reusability and maintainability.

## Type Files

### 1. **auth.types.ts**
Authentication and user session types
- `AuthUser` - User authentication interface
- `AuthState` - Auth reducer state
- `LoginCredentials` - Login form data
- NextAuth module augmentations (Session, JWT, User interfaces)

### 2. **project.types.ts**
Project and task management types
- `Comment` - Comment interface
- `Project` - Project interface with status and priority
- `ProjectItem` - Individual task/card interface
- `BoardColumn` - Kanban board column
- `ProjectFormData` - Project form submission data
- `ProjectState` - Projects reducer state

### 3. **user.types.ts**
User-related types
- `TeamMember` - Team member info
- `UserProfile` - User profile information
- `UserState` - User reducer state

### 4. **components.types.ts**
React component prop types
- `ProvidersProps` - Root providers wrapper props
- `ProjectCardProps` - Project card component props
- `ProjectModalProps` - Project modal props
- `NewProjectModalProps` - New project modal props
- `NewProjectButtonProps` - New project button props
- `EditMemberModalProps` - Edit member modal props (extended)

### 5. **forms.types.ts**
Form handling types
- `FormFields` - Generic form fields interface
- `UseFormOptions` - useForm hook options
- `UseFormReturn` - useForm hook return type

### 6. **redux.types.ts**
Redux store types
- `RootState` - Complete Redux state
- `AppDispatch` - Redux dispatch type

### 7. **index.ts**
Central export file for all types - allows convenient imports using:
```typescript
import type { AuthUser, Project, TeamMember } from "@/types";
```

## Updated Files

### Store Files
- `store/index.ts` - Now imports and re-exports Redux types
- `store/slices/authSlice.ts` - Imports from auth.types
- `store/slices/projectSlice.ts` - Imports from project.types
- `store/slices/userSlice.ts` - Imports from user.types

### Hook Files
- `hooks/useForm.ts` - Imports from forms.types

### Component Files
- `app/providers.tsx` - Imports from components.types
- `app/dashboard/projects/project-card.tsx` - Imports from components.types
- `app/dashboard/projects/new-project-button.tsx` - Imports from components.types
- `app/dashboard/projects/new-project-modal.tsx` - Imports from components.types
- `app/dashboard/projects/project-modal.tsx` - Imports from components.types
- `app/dashboard/projects/page.tsx` - Imports from project.types
- `app/dashboard/team/page.tsx` - Imports from user.types
- `app/dashboard/team/edit-member-modal.tsx` - Uses extended EditMemberModalProps

## Benefits
✅ **Centralized** - All types in one organized location
✅ **Reusable** - Easy to import and use across the application
✅ **Maintainable** - Changes to types only need to be made in one place
✅ **Scalable** - Easy to add new types as the application grows
✅ **Organized** - Types grouped by domain (auth, project, user, etc.)
✅ **Better DX** - Single source of truth for type definitions
