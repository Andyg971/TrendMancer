-- Création de la table des messages de l'assistant
CREATE TABLE assistant_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    role VARCHAR(50) NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    session_id UUID NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pour améliorer les performances des requêtes
CREATE INDEX idx_assistant_messages_session ON assistant_messages(session_id);
CREATE INDEX idx_assistant_messages_role ON assistant_messages(role);
CREATE INDEX idx_assistant_messages_timestamp ON assistant_messages(timestamp);

-- Trigger pour mettre à jour le timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_assistant_messages_updated_at
    BEFORE UPDATE ON assistant_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 