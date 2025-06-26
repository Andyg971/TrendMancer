-- Création de la table projects
CREATE TABLE public.projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Activer RLS pour projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Index pour owner_id
CREATE INDEX idx_projects_owner_id ON public.projects(owner_id);

-- Les utilisateurs peuvent voir leurs propres projets
CREATE POLICY "Utilisateurs peuvent voir leurs projets" 
ON public.projects FOR SELECT USING (auth.uid() = owner_id);

-- Les utilisateurs peuvent créer des projets
CREATE POLICY "Utilisateurs peuvent créer des projets" 
ON public.projects FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Les propriétaires peuvent mettre à jour leurs projets
CREATE POLICY "Propriétaires peuvent mettre à jour leurs projets" 
ON public.projects FOR UPDATE USING (auth.uid() = owner_id);

-- Les propriétaires peuvent supprimer leurs projets
CREATE POLICY "Propriétaires peuvent supprimer leurs projets" 
ON public.projects FOR DELETE USING (auth.uid() = owner_id);

-- Création de la table tasks
CREATE TABLE public.tasks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done', 'blocked')),
    priority VARCHAR(50) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    assigned_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Référence optionnelle à l'utilisateur assigné
    due_date DATE
);

-- Activer RLS pour tasks
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Index pour project_id et assigned_user_id
CREATE INDEX idx_tasks_project_id ON public.tasks(project_id);
CREATE INDEX idx_tasks_assigned_user_id ON public.tasks(assigned_user_id);

-- Politique RLS pour tasks (simplifiée : basé sur l'accès au projet parent)
-- Les utilisateurs peuvent voir les tâches des projets auxquels ils ont accès (ici, les projets dont ils sont propriétaires)
CREATE POLICY "Voir les tâches des projets possédés" 
ON public.tasks FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.projects
        WHERE public.projects.id = tasks.project_id
        AND public.projects.owner_id = auth.uid()
    )
);

-- Les utilisateurs peuvent créer des tâches pour les projets qu'ils possèdent
CREATE POLICY "Créer tâches pour projets possédés" 
ON public.tasks FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.projects
        WHERE public.projects.id = tasks.project_id
        AND public.projects.owner_id = auth.uid()
    )
);

-- Les utilisateurs peuvent modifier les tâches des projets qu'ils possèdent
CREATE POLICY "Modifier tâches des projets possédés" 
ON public.tasks FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM public.projects
        WHERE public.projects.id = tasks.project_id
        AND public.projects.owner_id = auth.uid()
    )
);

-- Les utilisateurs peuvent supprimer les tâches des projets qu'ils possèdent
CREATE POLICY "Supprimer tâches des projets possédés" 
ON public.tasks FOR DELETE USING (
    EXISTS (
        SELECT 1 FROM public.projects
        WHERE public.projects.id = tasks.project_id
        AND public.projects.owner_id = auth.uid()
    )
);

-- (Optionnel) Création de la table project_members si collaboration multi-utilisateurs avancée nécessaire
-- CREATE TABLE public.project_members (
--     id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
--     project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
--     user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
--     role VARCHAR(50) NOT NULL DEFAULT 'viewer' CHECK (role IN ('owner', 'editor', 'viewer')),
--     joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
--     UNIQUE(project_id, user_id) -- Assure qu'un utilisateur n'est membre qu'une fois par projet
-- );

-- ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
-- CREATE INDEX idx_project_members_project_id ON public.project_members(project_id);
-- CREATE INDEX idx_project_members_user_id ON public.project_members(user_id);

-- Politiques RLS pour project_members (si activé):
-- CREATE POLICY "Membres peuvent voir les autres membres du projet" 
-- ON public.project_members FOR SELECT USING (
--     EXISTS (
--         SELECT 1 FROM public.project_members pm
--         WHERE pm.project_id = project_members.project_id
--         AND pm.user_id = auth.uid()
--     )
-- );

-- CREATE POLICY "Propriétaires peuvent gérer les membres" 
-- ON public.project_members FOR ALL USING (
--     EXISTS (
--         SELECT 1 FROM public.projects p
--         WHERE p.id = project_members.project_id
--         AND p.owner_id = auth.uid()
--     )
-- ); 