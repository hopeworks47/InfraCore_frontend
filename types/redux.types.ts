// Redux store types
import type { AuthState } from './auth.types';
import type { ProjectState } from './project.types';
import type { UserState } from './user.types';

export interface RootState {
    auth: AuthState;
    projects: ProjectState;
    user: UserState;
}

export type AppDispatch = any; // Will be properly typed from store
